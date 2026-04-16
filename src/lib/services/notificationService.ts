import { SupabaseClient } from '@supabase/supabase-js';

const NOTIFICATION_TIMEOUT_MS = 2500;

export interface NotificationEvent {
  action: string;
  taskName: string;
  taskUrl: string;
  projectName: string;
  issueUrl?: string;
  assignee?: string;
}

const ACTION_TEXT: Record<string, string> = {
  created_task_from_github: 'New task created from GitHub',
  task_updated: 'Task updated on GitHub',
  task_closed: 'Task completed',
  task_assigned: 'Task assignment changed',
  pr_opened: 'Pull request opened',
  pr_closed: 'Pull request closed',
};

export function mapNotificationAction(eventType: string, action: string): string | null {
  if (eventType === 'issues') {
    if (action === 'opened' || action === 'reopened') return 'created_task_from_github';
    if (action === 'closed') return 'task_closed';
    if (action === 'assigned' || action === 'unassigned') return 'task_assigned';
    if (action === 'edited') return 'task_updated';
  }
  if (eventType === 'pull_request') {
    if (action === 'opened') return 'pr_opened';
    if (action === 'closed') return 'pr_closed';
  }
  return null;
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

interface SlackButton {
  type: 'button';
  text: { type: 'plain_text'; text: string };
  url: string;
}

function buildSlackMessage(event: NotificationEvent) {
  const headline = ACTION_TEXT[event.action] ?? event.action;
  const elements: SlackButton[] = [
    {
      type: 'button',
      text: { type: 'plain_text', text: 'View in Portal' },
      url: event.taskUrl,
    },
  ];
  if (event.issueUrl) {
    elements.push({
      type: 'button',
      text: { type: 'plain_text', text: 'View on GitHub' },
      url: event.issueUrl,
    });
  }

  return {
    blocks: [
      {
        type: 'section',
        text: {
          type: 'mrkdwn',
          text: `*${headline}*\n*${event.taskName}* in _${event.projectName}_${
            event.assignee ? `\nAssigned to: ${event.assignee}` : ''
          }`,
        },
      },
      { type: 'actions', elements },
    ],
  };
}

interface DiscordField {
  name: string;
  value: string;
  inline: boolean;
}

function buildDiscordMessage(event: NotificationEvent) {
  const headline = ACTION_TEXT[event.action] ?? event.action;
  const fields: DiscordField[] = [
    { name: 'Portal', value: `[View Task](${event.taskUrl})`, inline: true },
  ];
  if (event.issueUrl) {
    fields.unshift({
      name: 'GitHub',
      value: `[View Issue](${event.issueUrl})`,
      inline: true,
    });
  }

  return {
    embeds: [
      {
        title: headline,
        description: `**${event.taskName}** in _${event.projectName}_${
          event.assignee ? `\nAssigned to: ${event.assignee}` : ''
        }`,
        color: event.action === 'task_closed' ? 0x2ea043 : 0x58a6ff,
        fields,
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
