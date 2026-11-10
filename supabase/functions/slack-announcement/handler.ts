import { createHash, timingSafeEqual } from 'node:crypto';

export interface Announcement {
  title: string;
  description: string | null;
  visibility: string;
  project_id: string | null;
  target_team: string | null;
  link_url: string | null;
  priority: string;
}

interface Dependencies {
  env: (name: string) => string | undefined;
  getAnnouncement: (id: string) => Promise<Announcement | null>;
  getProjectChannel: (id: string) => Promise<string | null>;
  fetch: typeof fetch;
}

const TEAM_CHANNEL_SECRETS: Record<string, string> = {
  tech: 'SLACK_TECH_CHANNEL_ID',
  finance: 'SLACK_FINANCE_CHANNEL_ID',
  marketing: 'SLACK_MARKETING_CHANNEL_ID',
  design: 'SLACK_DESIGN_CHANNEL_ID',
  project_managers: 'SLACK_PROJECT_MANAGERS_CHANNEL_ID',
};

function json(body: object, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}

function escapeSlack(text: string): string {
  return text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

// Slack block limits: header plain_text 150 chars, section mrkdwn 3000 chars.
const HEADER_MAX = 150;
const SECTION_MAX = 3000;

function truncate(text: string, max: number): string {
  if (text.length <= max) return text;
  // Drop a dangling surrogate half so the cut never produces an invalid character.
  return text.slice(0, max - 1).replace(/[\uD800-\uDBFF]$/, '') + '…';
}

function secretsMatch(provided: string, expected: string): boolean {
  // Fixed-size digests let timingSafeEqual compare secrets of any byte length.
  const digest = (value: string) => createHash('sha256').update(value).digest();
  return timingSafeEqual(digest(provided), digest(expected));
}

function isObject(value: unknown): value is Record<string, unknown> {
  return value !== null && typeof value === 'object' && !Array.isArray(value);
}

function safeLink(value: string): string | null {
  try {
    const url = new URL(value);
    if (url.protocol !== 'https:' && url.protocol !== 'http:') return null;
    // Prevent a URL from closing Slack's link markup or injecting a label.
    return escapeSlack(url.href.replace(/\|/g, '%7C'));
  } catch {
    return null;
  }
}

export function createAnnouncementHandler(deps: Dependencies) {
  return async (req: Request): Promise<Response> => {
    if (req.method !== 'POST') {
      return new Response('Method not allowed', { status: 405, headers: { Allow: 'POST' } });
    }

    const secret = deps.env('SLACK_ANNOUNCEMENT_WEBHOOK_SECRET');
    if (!secret) return json({ error: 'Webhook secret is not configured' }, 503);

    const provided = req.headers.get('x-webhook-secret');
    if (!provided || !secretsMatch(provided, secret)) {
      return json({ error: 'Unauthorized' }, 401);
    }

    const token = deps.env('SLACK_BOT_TOKEN');
    if (!token) return json({ error: 'Slack bot token is not configured' }, 503);

    let payload: unknown;
    try {
      payload = await req.json();
    } catch {
      return json({ error: 'Invalid JSON' }, 400);
    }
    if (!isObject(payload)) {
      return json({ error: 'Invalid webhook payload' }, 400);
    }
    if (payload.type === 'UPDATE' || payload.type === 'DELETE') {
      return json({ message: 'Ignore non-insert event' });
    }
    if (payload.type !== 'INSERT') {
      return json({ error: 'Invalid webhook event type' }, 400);
    }
    if (payload.schema !== 'public' || payload.table !== 'project_announcements') {
      return json({ error: 'Unexpected webhook source' }, 400);
    }
    const id = isObject(payload.record) ? payload.record.id : undefined;
    if (typeof id !== 'string' || !id.trim()) {
      return json({ error: 'Missing announcement ID' }, 400);
    }

    try {
      // Only the ID comes from the webhook. All content and routing come from the database.
      const announcement = await deps.getAnnouncement(id);
      if (!announcement) return json({ error: 'Announcement not found' }, 404);
      const { title, description, visibility, project_id, target_team, link_url, priority } = announcement;

      let channelId: string | null | undefined;
      if (visibility === 'project' && project_id) {
        channelId = await deps.getProjectChannel(project_id);
      } else if (visibility === 'team' && target_team) {
        const name = Object.hasOwn(TEAM_CHANNEL_SECRETS, target_team)
          ? TEAM_CHANNEL_SECRETS[target_team] : undefined;
        channelId = name ? deps.env(name) : undefined;
      } else if (visibility === 'club_wide' || visibility === 'board') {
        const boardChannel = deps.env('SLACK_BOARD_CHANNEL_ID');
        const clubChannel = deps.env('SLACK_CLUB_WIDE_CHANNEL_ID');
        // These audiences may intentionally share a Slack channel.
        channelId = visibility === 'board' ? boardChannel : clubChannel;
      }
      channelId = channelId?.trim();
      if (!channelId || !/^[CG][A-Z0-9]+$/.test(channelId)) {
        console.warn(`No Slack channel mapping found for: visibility=${visibility}, team=${target_team}, project=${project_id}`);
        // Projects without a Slack channel are a normal state; other audiences need a configured secret.
        if (visibility === 'project') return json({ error: 'No channel mapping' });
        return json({ error: 'No valid Slack channel configured for this audience' }, 503);
      }

      const safeTitle = escapeSlack(title);
      // Escaping lengthens text, so truncate afterwards and drop any entity cut in half.
      const escapedDescription = escapeSlack(description || '');
      const slackDescription = priority === 'high' ? `<!channel>\n${escapedDescription}` : escapedDescription;
      const safeDescription = truncate(slackDescription, SECTION_MAX).replace(/&[a-z]{0,3}…$/, '…');
      const blocks = [
        // plain_text is never parsed for mentions and Slack shows entities literally, so use the raw title.
        { type: 'header', text: { type: 'plain_text', text: truncate(`📢 ${title}`, HEADER_MAX), emoji: true } },
        // Disable automatic @here/@channel parsing; the trusted <!channel> still works.
        { type: 'section', text: { type: 'mrkdwn', text: safeDescription || ' ', verbatim: true } },
      ];

      const link = link_url ? safeLink(link_url) : null;
      if (link) {
        blocks.push({
          type: 'section',
          text: { type: 'mrkdwn', text: `<${link}|View more details>`, verbatim: true },
        });
      }

      const slackRes = await deps.fetch('https://slack.com/api/chat.postMessage', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ channel: channelId, blocks, text: `New Announcement: ${safeTitle}` }),
      });
      const result = await slackRes.json();
      if (!slackRes.ok || !result.ok) {
        console.error('Slack announcement delivery failed:', result.error);
        return json({ error: 'Slack delivery failed' }, 502);
      }
      return json({ ok: true });
    } catch (err: unknown) {
      console.error('Slack announcement function error:', err);
      return json({ error: 'Announcement delivery failed' }, 500);
    }
  };
}
