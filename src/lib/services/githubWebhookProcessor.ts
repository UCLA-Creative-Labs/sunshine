import type { SupabaseClient } from '@supabase/supabase-js';
import {
  dispatchNotifications,
  mapNotificationAction,
  type NotificationEvent,
} from './notificationService';

const PENDING_PUSH_WINDOW_MS = 30_000;

export interface WebhookEvent {
  deliveryId: string;
  eventType: string;
  payload: Record<string, unknown>;
  existingId?: number;
}

interface GithubLabel {
  name: string;
  color?: string;
}

interface GithubAssignee {
  login: string;
}

interface GithubIssue {
  id: number;
  node_id: string;
  number: number;
  title: string;
  body: string | null;
  html_url: string;
  state: string;
  labels?: GithubLabel[];
  assignees?: GithubAssignee[];
}

interface GithubPullRequest {
  id: number;
  node_id: string;
  number: number;
  body: string | null;
  html_url: string;
  merged: boolean;
}

const LABEL_MAP: Record<string, { name: string; color: string }> = {
  bug: { name: 'Bug', color: '#FFE6D5' },
  feature: { name: 'Feature', color: '#E2F7E6' },
  ux: { name: 'UX', color: '#FFF1C2' },
  backend: { name: 'Backend', color: '#E5F3FF' },
  frontend: { name: 'Frontend', color: '#ECE3FF' },
  documentation: { name: 'Documentation', color: '#F3E8FF' },
};

const DEFAULT_LABEL = { name: 'Feature', color: '#E2F7E6' };

export async function processEvent(
  supabase: SupabaseClient,
  event: WebhookEvent,
): Promise<void> {
  const { deliveryId, eventType, payload } = event;
  const action = (payload.action as string | undefined) ?? 'unknown';
  const repoFullName = (payload.repository as { full_name?: string } | undefined)?.full_name;

  const projectId = await resolveProjectId(supabase, repoFullName);
  if (!projectId) return;

  const issue = payload.issue as GithubIssue | undefined;
  const pr = payload.pull_request as GithubPullRequest | undefined;

  const { data: integration, error: integrationErr } = await supabase
    .from('github_integrations')
    .upsert(
      {
        delivery_id: deliveryId,
        event_type: eventType,
        action,
        github_id: issue?.id ?? pr?.id ?? null,
        github_node_id: issue?.node_id ?? pr?.node_id ?? null,
        github_number: issue?.number ?? pr?.number ?? null,
        payload,
        project_id: projectId,
        processed: false,
        error_message: null,
      },
      { onConflict: 'delivery_id' },
    )
    .select('id')
    .single();

  if (integrationErr || !integration) {
    throw new Error(
      `github_integrations upsert failed for delivery ${deliveryId}: ${integrationErr?.message ?? 'no row returned'}`,
    );
  }

  const integrationId = (integration as { id: number }).id;

  try {
    if (eventType === 'issues' && issue) {
      await processIssueEvent(supabase, projectId, action, issue, integrationId);
    } else if (eventType === 'pull_request' && pr) {
      await processPREvent(supabase, projectId, action, pr);
    }

    const { error: processedError } = await supabase
      .from('github_integrations')
      .update({ processed: true, processed_at: new Date().toISOString() })
      .eq('id', integrationId);
    if (processedError) {
      throw new Error(`marking delivery ${deliveryId} processed failed: ${processedError.message}`);
    }

    // best-effort chat notification — never let failure here surface to github
    const notificationAction = mapNotificationAction(eventType, action);
    if (notificationAction) {
      const item = issue ?? pr;
      if (item) {
        const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ?? '';
        const senderObj = payload.sender as
          | { login?: string; html_url?: string; avatar_url?: string }
          | undefined;
        const repoObj = payload.repository as
          | { full_name?: string; html_url?: string }
          | undefined;
        const taskName = (issue?.title ?? `Pull request #${pr?.number ?? ''}`).trim();

        const event: NotificationEvent = {
          action: notificationAction,
          taskName,
          taskNumber: issue?.number ?? pr?.number,
          taskUrl: `${baseUrl}/portal/projects/${projectId}/board`,
          projectName: '',
          repoFullName: repoObj?.full_name,
          repoUrl: repoObj?.html_url,
          issueUrl: item.html_url,
          description: issue?.body ?? pr?.body ?? null,
          labels: issue?.labels?.map((l) => l.name).filter(Boolean),
          assignees: issue?.assignees?.map((a) => a.login).filter(Boolean),
          actor: senderObj?.login,
          actorUrl: senderObj?.html_url,
          actorAvatarUrl: senderObj?.avatar_url,
        };

        try {
          await dispatchNotifications(supabase, projectId, event);
        } catch (err) {
          console.error('notification dispatch failed:', err);
        }
      }
    }
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    const { error: recordError } = await supabase
      .from('github_integrations')
      .update({ processed: false, processed_at: null, error_message: message })
      .eq('id', integrationId);
    if (recordError) {
      throw new Error(
        `recording failure for delivery ${deliveryId} failed: ${recordError.message}; original error: ${message}`,
      );
    }
    throw err;
  }
}

async function resolveProjectId(
  supabase: SupabaseClient,
  repoFullName: string | undefined,
): Promise<string | null> {
  if (!repoFullName) return null;
  const { data, error } = await supabase
    .from('projects')
    .select('id')
    .eq('github_repo', repoFullName.toLowerCase())
    .maybeSingle();
  if (error) {
    throw new Error(`project lookup failed for repository ${repoFullName}: ${error.message}`);
  }
  return (data as { id: string } | null)?.id ?? null;
}

async function processIssueEvent(
  supabase: SupabaseClient,
  projectId: string,
  action: string,
  issue: GithubIssue,
  integrationId: number,
): Promise<void> {
  const { data: existing, error: existingError } = await supabase
    .from('tasks')
    .select('id, synced_from_github, created_by')
    .eq('project_id', projectId)
    .eq('github_issue_number', issue.number)
    .maybeSingle();
  if (existingError) {
    throw new Error(`task lookup failed for issue #${issue.number}: ${existingError.message}`);
  }

  const existingTask = existing as { id: number; synced_from_github: boolean; created_by: string | null } | null;
  const existingTaskId = existingTask?.id ?? null;

  switch (action) {
    case 'opened':
    case 'reopened': {
      if (existingTaskId) {
        await updateTaskFromIssue(supabase, existingTaskId, issue);
        // A previous attempt may have created/linked the task before a later
        // write failed. Resume those writes instead of treating existence as done.
        await linkIntegrationToTask(supabase, integrationId, existingTaskId);
        await syncAssignments(supabase, existingTaskId, issue.assignees ?? []);
        // Portal-created tasks can also be synced from GitHub after a push.
        // Their original creation belongs to the portal user, not this webhook.
        if (existingTask?.synced_from_github && existingTask.created_by === null) {
          await ensureTaskCreationActivity(supabase, projectId, existingTaskId, issue);
        }
        return;
      }

      // bounce-back from "push to github" — link to the pending task instead of creating a duplicate
      const pendingTaskId = await findPendingPushTask(supabase, projectId);
      if (pendingTaskId) {
        await linkPendingTaskToIssue(supabase, pendingTaskId, issue, integrationId);
        return;
      }

      await createTaskFromIssue(supabase, projectId, issue, integrationId);
      return;
    }

    case 'edited': {
      if (existingTaskId) {
        await updateTaskFromIssue(supabase, existingTaskId, issue);
      }
      return;
    }

    case 'closed': {
      if (existingTaskId) {
        const { error } = await supabase
          .from('tasks')
          .update({
            status: 'done',
            completed_at: new Date().toISOString(),
            last_github_sync_at: new Date().toISOString(),
          })
          .eq('id', existingTaskId);
        if (error) {
          throw new Error(`closing task ${existingTaskId} for issue #${issue.number} failed: ${error.message}`);
        }
      }
      return;
    }

    case 'assigned':
    case 'unassigned': {
      if (existingTaskId) {
        await syncAssignments(supabase, existingTaskId, issue.assignees ?? []);
      }
      return;
    }
  }
}

async function findPendingPushTask(
  supabase: SupabaseClient,
  projectId: string,
): Promise<number | null> {
  const cutoff = new Date(Date.now() - PENDING_PUSH_WINDOW_MS).toISOString();
  const { data, error } = await supabase
    .from('tasks')
    .select('id')
    .eq('project_id', projectId)
    .eq('synced_from_github', false)
    .is('github_issue_number', null)
    .not('github_push_pending_at', 'is', null)
    .gte('github_push_pending_at', cutoff)
    .order('github_push_pending_at', { ascending: false })
    .limit(1)
    .maybeSingle();
  if (error) {
    throw new Error(`pending push lookup failed for project ${projectId}: ${error.message}`);
  }

  return (data as { id: number } | null)?.id ?? null;
}

async function linkPendingTaskToIssue(
  supabase: SupabaseClient,
  taskId: number,
  issue: GithubIssue,
  integrationId: number,
): Promise<void> {
  await updateTaskFromIssue(supabase, taskId, issue);

  const { error: linkError } = await supabase
    .from('tasks')
    .update({
      github_issue_number: issue.number,
      github_issue_url: issue.html_url,
      github_push_pending_at: null,
      synced_from_github: true,
      last_github_sync_at: new Date().toISOString(),
    })
    .eq('id', taskId);
  if (linkError) {
    throw new Error(`linking pending task ${taskId} to issue #${issue.number} failed: ${linkError.message}`);
  }

  await linkIntegrationToTask(supabase, integrationId, taskId);

  if (issue.assignees?.length) {
    await syncAssignments(supabase, taskId, issue.assignees);
  }
}

async function createTaskFromIssue(
  supabase: SupabaseClient,
  projectId: string,
  issue: GithubIssue,
  integrationId: number,
): Promise<void> {
  const labelInfo = extractLabelInfo(issue.labels);

  const { data: task, error: upsertErr } = await supabase
    .from('tasks')
    .upsert(
      {
        project_id: projectId,
        name: issue.title,
        description: issue.body,
        status: issue.state === 'open' ? 'todo' : 'done',
        priority: extractPriority(issue.labels),
        label: labelInfo.name,
        label_color: labelInfo.color,
        github_issue_number: issue.number,
        github_issue_url: issue.html_url,
        synced_from_github: true,
        last_github_sync_at: new Date().toISOString(),
      },
      { onConflict: 'project_id,github_issue_number' },
    )
    .select('id')
    .single();

  if (upsertErr || !task) {
    throw new Error(`task upsert failed for issue #${issue.number}: ${upsertErr?.message ?? 'no row returned'}`);
  }

  const taskId = (task as { id: number }).id;

  await linkIntegrationToTask(supabase, integrationId, taskId);

  if (issue.assignees?.length) {
    await syncAssignments(supabase, taskId, issue.assignees);
  }

  await ensureTaskCreationActivity(supabase, projectId, taskId, issue);
}

async function linkIntegrationToTask(
  supabase: SupabaseClient,
  integrationId: number,
  taskId: number,
): Promise<void> {
  const { error: integrationError } = await supabase
    .from('github_integrations')
    .update({ task_id: taskId })
    .eq('id', integrationId);
  if (integrationError) {
    throw new Error(`linking integration ${integrationId} to task ${taskId} failed: ${integrationError.message}`);
  }
}

async function ensureTaskCreationActivity(
  supabase: SupabaseClient,
  projectId: string,
  taskId: number,
  issue: GithubIssue,
): Promise<void> {
  // Completion can fail after the log insert succeeded. Replays should reuse
  // that entry rather than inserting another creation message for the same task.
  const { data: activity, error: lookupError } = await supabase
    .from('activity_log')
    .select('id')
    .eq('project_id', projectId)
    .eq('task_id', taskId)
    .eq('action', 'created_task_from_github')
    .contains('metadata', { github_issue_number: issue.number })
    .limit(1)
    .maybeSingle();
  if (lookupError) {
    throw new Error(`activity log lookup failed for task ${taskId}: ${lookupError.message}`);
  }
  if (activity) return;

  const { error: activityError } = await supabase.from('activity_log').insert({
    action: 'created_task_from_github',
    project_id: projectId,
    task_id: taskId,
    metadata: { github_issue_number: issue.number },
  });
  if (activityError) {
    throw new Error(`activity log insert failed for task ${taskId}: ${activityError.message}`);
  }
}

async function updateTaskFromIssue(
  supabase: SupabaseClient,
  taskId: number,
  issue: GithubIssue,
): Promise<void> {
  const { error } = await supabase
    .from('tasks')
    .update({
      name: issue.title,
      description: issue.body,
      status: issue.state === 'open' ? 'todo' : 'done',
      priority: extractPriority(issue.labels),
      last_github_sync_at: new Date().toISOString(),
    })
    .eq('id', taskId);
  if (error) {
    throw new Error(`updating task ${taskId} from issue #${issue.number} failed: ${error.message}`);
  }
}

async function syncAssignments(
  supabase: SupabaseClient,
  taskId: number,
  assignees: GithubAssignee[],
): Promise<void> {
  // delete then insert — brief gap is fine since the UI uses refetch, not realtime
  const { error: deleteError } = await supabase.from('task_assignments').delete().eq('task_id', taskId);
  if (deleteError) {
    throw new Error(`clearing assignments for task ${taskId} failed: ${deleteError.message}`);
  }

  const usernames = assignees.map((a) => a.login.toLowerCase()).filter(Boolean);
  if (!usernames.length) return;

  const { data: profiles, error: profilesError } = await supabase
    .from('profiles')
    .select('id')
    .in('github_username', usernames);
  if (profilesError) {
    throw new Error(`assignee profile lookup failed for task ${taskId}: ${profilesError.message}`);
  }

  const matched = (profiles as { id: string }[] | null) ?? [];
  if (!matched.length) return;

  const { error: insertError } = await supabase
    .from('task_assignments')
    .insert(matched.map((p) => ({ task_id: taskId, user_id: p.id, assigned_by: null })));
  if (insertError) {
    throw new Error(`saving assignments for task ${taskId} failed: ${insertError.message}`);
  }
}

async function processPREvent(
  supabase: SupabaseClient,
  projectId: string,
  action: string,
  pr: GithubPullRequest,
): Promise<void> {
  // PRs link to existing issue-based tasks via "Closes #N" / "Fixes #N" / "Resolves #N"
  const ref = pr.body?.match(/(?:closes|fixes|resolves)\s+#(\d+)/i);
  if (!ref) return;

  const issueNumber = Number.parseInt(ref[1], 10);

  const { data: task, error: taskError } = await supabase
    .from('tasks')
    .select('id')
    .eq('project_id', projectId)
    .eq('github_issue_number', issueNumber)
    .maybeSingle();
  if (taskError) {
    throw new Error(`task lookup failed for pull request #${pr.number}: ${taskError.message}`);
  }

  if (!task) return;

  const taskId = (task as { id: number }).id;
  const updates: Record<string, unknown> = {
    github_pr_number: pr.number,
    github_pr_url: pr.html_url,
    last_github_sync_at: new Date().toISOString(),
  };

  if (action === 'opened') {
    updates.status = 'in_review';
  } else if (action === 'closed' && pr.merged) {
    updates.status = 'done';
    updates.completed_at = new Date().toISOString();
  }

  const { error: updateError } = await supabase.from('tasks').update(updates).eq('id', taskId);
  if (updateError) {
    throw new Error(`updating task ${taskId} from pull request #${pr.number} failed: ${updateError.message}`);
  }
}

function extractPriority(labels: GithubLabel[] | undefined): string {
  if (!labels?.length) return 'medium';
  const priority = labels.find((l) => l.name.toLowerCase().includes('priority'));
  if (!priority) return 'medium';
  const name = priority.name.toLowerCase();
  if (name.includes('urgent')) return 'urgent';
  if (name.includes('high')) return 'high';
  if (name.includes('low')) return 'low';
  return 'medium';
}

function extractLabelInfo(labels: GithubLabel[] | undefined): { name: string; color: string } {
  if (!labels?.length) return DEFAULT_LABEL;
  const match = labels.find((l) => LABEL_MAP[l.name.toLowerCase()]);
  return match ? LABEL_MAP[match.name.toLowerCase()] : DEFAULT_LABEL;
}
