import { SupabaseClient } from '@supabase/supabase-js';

const NOTIFICATION_TIMEOUT_MS = 2500;
const BODY_EXCERPT_MAX = 500;
const GITHUB_ICON_URL =
  'https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png';

export interface NotificationEvent {
  action: string;
  taskName: string;
  taskNumber?: number;
  taskUrl: string;
  projectName: string;
  repoFullName?: string;
  repoUrl?: string;
  issueUrl?: string;
  description?: string | null;
  labels?: string[];
  assignees?: string[];
  actor?: string;
  actorUrl?: string;
  actorAvatarUrl?: string;
}

export function mapNotificationAction(eventType: string, action: string): string | null {
  if (eventType === 'issues') {
    if (action === 'opened' || action === 'reopened') return 'issue_opened';
    if (action === 'closed') return 'issue_closed';
    if (action === 'edited') return 'issue_edited';
  }
  if (eventType === 'pull_request') {
    if (action === 'opened') return 'pr_opened';
    if (action === 'closed') return 'pr_closed';
  }
  return null;
}

function actionVerb(action: string): string {
  switch (action) {
    case 'issue_opened':
      return 'Issue opened';
    case 'issue_closed':
      return 'Issue closed';
    case 'issue_edited':
      return 'Issue edited';
    case 'pr_opened':
      return 'Pull request opened';
    case 'pr_closed':
      return 'Pull request closed';
    default:
      return action;
  }
}

function colorFor(action: string): { hex: string; int: number } {
  if (action === 'issue_opened' || action === 'pr_opened') {
    return { hex: '#57ab5a', int: 0x57ab5a };
  }
  if (action === 'issue_closed' || action === 'pr_closed') {
    return { hex: '#a371f7', int: 0xa371f7 };
  }
  return { hex: '#79b8ff', int: 0x79b8ff };
}

function truncate(text: string, max: number): string {
  if (text.length <= max) return text;
  return `${text.slice(0, max - 1).trimEnd()}…`;
}

export async function notifySlack(url: string, event: NotificationEvent): Promise<void> {
  await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    signal: AbortSignal.timeout(NOTIFICATION_TIMEOUT_MS),
    body: JSON.stringify(buildSlackMessage(event)),
  });
}

export async function notifyDiscord(url: string, event: NotificationEvent): Promise<void> {
  await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    signal: AbortSignal.timeout(NOTIFICATION_TIMEOUT_MS),
    body: JSON.stringify(buildDiscordMessage(event)),
  });
}

interface SlackBlock {
  type: string;
  text?: { type: string; text: string };
  elements?: unknown[];
}

function buildSlackMessage(event: NotificationEvent) {
  const color = colorFor(event.action).hex;
  const verb = actionVerb(event.action);

  const actorText = event.actor ? escapeSlack(event.actor) : '';
  const actorLink =
    event.actorUrl && actorText ? `<${event.actorUrl}|${actorText}>` : actorText;
  const topText = actorLink ? `${verb} by ${actorLink}` : verb;

  const numberPrefix = event.taskNumber ? `#${event.taskNumber} ` : '';
  const titleText = `${numberPrefix}${event.taskName}`;
  const titleLine = event.issueUrl
    ? `*<${event.issueUrl}|${escapeSlack(titleText)}>*`
    : `*${escapeSlack(titleText)}*`;

  const blocks: SlackBlock[] = [
    { type: 'section', text: { type: 'mrkdwn', text: titleLine } },
  ];

  if (event.description?.trim()) {
    blocks.push({
      type: 'section',
      text: {
        type: 'mrkdwn',
        text: truncate(event.description.trim(), BODY_EXCERPT_MAX),
      },
    });
  }

  const metaParts: string[] = [];
  if (event.labels?.length) {
    metaParts.push(`🏷  ${event.labels.map((l) => `\`${l}\``).join(' · ')}`);
  }
  if (event.assignees?.length) {
    metaParts.push(`👥  ${event.assignees.join(', ')}`);
  }
  if (event.projectName) {
    metaParts.push(`📁  _${escapeSlack(event.projectName)}_`);
  }
  if (metaParts.length) {
    blocks.push({
      type: 'context',
      elements: [{ type: 'mrkdwn', text: metaParts.join('     ') }],
    });
  }

  const footerParts: string[] = [];
  if (event.repoFullName) {
    const repoText = escapeSlack(event.repoFullName);
    footerParts.push(
      event.repoUrl ? `<${event.repoUrl}|${repoText}>` : repoText,
    );
  }
  if (event.issueUrl) footerParts.push(`<${event.issueUrl}|View on GitHub>`);
  if (event.taskUrl) footerParts.push(`<${event.taskUrl}|Open in CL Portal>`);
  if (footerParts.length) {
    blocks.push({
      type: 'context',
      elements: [{ type: 'mrkdwn', text: footerParts.join('  ·  ') }],
    });
  }

  return {
    text: topText,
    attachments: [{ color, blocks }],
  };
}

// minimal escape — slack mrkdwn treats <, >, & specially inside link text
function escapeSlack(s: string): string {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

interface DiscordField {
  name: string;
  value: string;
  inline: boolean;
}

function buildDiscordMessage(event: NotificationEvent) {
  const color = colorFor(event.action).int;
  const verb = actionVerb(event.action);

  const numberPrefix = event.taskNumber ? `#${event.taskNumber} ` : '';
  const titleText = `${numberPrefix}${event.taskName}`;

  const fields: DiscordField[] = [];
  if (event.labels?.length) {
    fields.push({ name: 'Labels', value: event.labels.join(' · '), inline: true });
  }
  if (event.assignees?.length) {
    fields.push({
      name: 'Assignees',
      value: event.assignees.join(', '),
      inline: true,
    });
  }
  if (event.projectName) {
    fields.push({ name: 'Project', value: event.projectName, inline: true });
  }

  const authorName = event.actor ? `${event.actor} · ${verb.toLowerCase()}` : verb;

  return {
    embeds: [
      {
        author: {
          name: authorName,
          url: event.actorUrl,
          icon_url: event.actorAvatarUrl,
        },
        title: titleText,
        url: event.issueUrl,
        description: event.description?.trim()
          ? truncate(event.description.trim(), BODY_EXCERPT_MAX)
          : undefined,
        color,
        fields,
        footer: event.repoFullName
          ? { text: event.repoFullName, icon_url: GITHUB_ICON_URL }
          : undefined,
        timestamp: new Date().toISOString(),
      },
    ],
  };
}

// dispatches to slack + discord, never throws — chat failures must not fail webhook processing
export async function dispatchNotifications(
  supabase: SupabaseClient,
  projectId: string,
  event: NotificationEvent,
): Promise<void> {
  const { data } = await supabase
    .from('projects')
    .select('projectName, slack_webhook_url, discord_webhook_url')
    .eq('id', projectId)
    .maybeSingle();

  const project = data as
    | {
        projectName?: string | null;
        slack_webhook_url?: string | null;
        discord_webhook_url?: string | null;
      }
    | null;

  if (!project) return;

  const enriched: NotificationEvent = {
    ...event,
    projectName: event.projectName || project.projectName || 'Unknown',
  };

  const tasks: Promise<unknown>[] = [];
  if (project.slack_webhook_url) {
    tasks.push(
      notifySlack(project.slack_webhook_url, enriched).catch((err) =>
        console.error('slack notification failed:', err),
      ),
    );
  }
  if (project.discord_webhook_url) {
    tasks.push(
      notifyDiscord(project.discord_webhook_url, enriched).catch((err) =>
        console.error('discord notification failed:', err),
      ),
    );
  }

  await Promise.allSettled(tasks);
}
