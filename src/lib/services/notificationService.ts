import { SupabaseClient } from '@supabase/supabase-js';

const NOTIFICATION_TIMEOUT_MS = 2500;
const BODY_EXCERPT_MAX = 500;

export interface NotificationEvent {
  action: string;
  taskName: string;
  taskNumber?: number;
  taskUrl: string;
  projectName: string;
  repoFullName?: string;
  issueUrl?: string;
  description?: string | null;
  labels?: string[];
  assignees?: string[];
  actor?: string;
}

export function mapNotificationAction(eventType: string, action: string): string | null {
  if (eventType === 'issues') {
    if (action === 'opened' || action === 'reopened') return 'issue_opened';
    if (action === 'closed') return 'issue_closed';
    if (action === 'assigned' || action === 'unassigned') return 'issue_assigned';
    if (action === 'edited') return 'issue_edited';
  }
  if (eventType === 'pull_request') {
    if (action === 'opened') return 'pr_opened';
    if (action === 'closed') return 'pr_closed';
  }
  return null;
}

function headlineFor(action: string, actor: string | undefined): string {
  const who = actor ? ` by ${actor}` : '';
  switch (action) {
    case 'issue_opened':
      return `Issue opened${who}`;
    case 'issue_closed':
      return `Issue closed${who}`;
    case 'issue_edited':
      return `Issue edited${who}`;
    case 'issue_assigned':
      return `Issue assignment changed${who}`;
    case 'pr_opened':
      return `Pull request opened${who}`;
    case 'pr_closed':
      return `Pull request closed${who}`;
    default:
      return action;
  }
}

function colorFor(action: string): { hex: string; int: number } {
  if (action === 'issue_opened' || action === 'pr_opened') {
    return { hex: '#2ea043', int: 0x2ea043 };
  }
  if (action === 'issue_closed' || action === 'pr_closed') {
    return { hex: '#8957e5', int: 0x8957e5 };
  }
  return { hex: '#58a6ff', int: 0x58a6ff };
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
  const headline = headlineFor(event.action, event.actor);
  const color = colorFor(event.action).hex;

  const numberPrefix = event.taskNumber ? `#${event.taskNumber} ` : '';
  const titleText = `${numberPrefix}${event.taskName}`;
  const titleMrkdwn = event.issueUrl
    ? `*<${event.issueUrl}|${escapeSlack(titleText)}>*`
    : `*${escapeSlack(titleText)}*`;

  const blocks: SlackBlock[] = [
    { type: 'section', text: { type: 'mrkdwn', text: titleMrkdwn } },
  ];

  if (event.description) {
    blocks.push({
      type: 'section',
      text: { type: 'mrkdwn', text: truncate(event.description, BODY_EXCERPT_MAX) },
    });
  }

  const contextParts: string[] = [];
  if (event.repoFullName) contextParts.push(`\`${event.repoFullName}\``);
  if (event.projectName) contextParts.push(`_${event.projectName}_`);
  if (event.labels?.length) {
    contextParts.push(`Labels: ${event.labels.map((l) => `\`${l}\``).join(' ')}`);
  }
  if (event.assignees?.length) {
    contextParts.push(`Assigned: ${event.assignees.map((a) => `@${a}`).join(' ')}`);
  }

  if (contextParts.length) {
    blocks.push({
      type: 'context',
      elements: [{ type: 'mrkdwn', text: contextParts.join(' · ') }],
    });
  }

  const buttons: unknown[] = [
    {
      type: 'button',
      text: { type: 'plain_text', text: 'View in Portal' },
      url: event.taskUrl,
    },
  ];
  if (event.issueUrl) {
    buttons.push({
      type: 'button',
      text: { type: 'plain_text', text: 'View on GitHub' },
      url: event.issueUrl,
    });
  }
  blocks.push({ type: 'actions', elements: buttons });

  return {
    text: headline,
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
  const headline = headlineFor(event.action, event.actor);
  const color = colorFor(event.action).int;

  const numberPrefix = event.taskNumber ? `#${event.taskNumber} ` : '';
  const titleText = `${numberPrefix}${event.taskName}`;

  const fields: DiscordField[] = [];
  if (event.labels?.length) {
    fields.push({ name: 'Labels', value: event.labels.join(', '), inline: true });
  }
  if (event.assignees?.length) {
    fields.push({
      name: 'Assignees',
      value: event.assignees.map((a) => `@${a}`).join(', '),
      inline: true,
    });
  }
  if (event.projectName) {
    fields.push({ name: 'Project', value: event.projectName, inline: true });
  }
  fields.push({ name: 'Portal', value: `[View Task](${event.taskUrl})`, inline: false });

  return {
    embeds: [
      {
        author: { name: headline },
        title: titleText,
        url: event.issueUrl,
        description: event.description ? truncate(event.description, BODY_EXCERPT_MAX) : undefined,
        color,
        fields,
        footer: event.repoFullName ? { text: event.repoFullName } : undefined,
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
