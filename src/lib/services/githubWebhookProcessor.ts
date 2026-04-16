import { SupabaseClient } from '@supabase/supabase-js';

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
  const { deliveryId, eventType, payload, existingId } = event;
  const action = (payload.action as string | undefined) ?? 'unknown';
  const repoFullName = (payload.repository as { full_name?: string } | undefined)?.full_name;

  const projectId = await resolveProjectId(supabase, repoFullName);
  if (!projectId) return;

  const issue = payload.issue as GithubIssue | undefined;
  const pr = payload.pull_request as GithubPullRequest | undefined;

  const { data: integration } = await supabase
    .from('github_integrations')
    .upsert(
      {
        ...(existingId ? { id: existingId } : {}),
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

  if (!integration) {
    throw new Error(`Failed to upsert github_integrations row for delivery ${deliveryId}`);
  }

  const integrationId = (integration as { id: number }).id;

  try {
    if (eventType === 'issues' && issue) {
      await processIssueEvent(supabase, projectId, action, issue, integrationId);
    } else if (eventType === 'pull_request' && pr) {
      await processPREvent(supabase, projectId, action, pr);
    }

    await supabase
      .from('github_integrations')
      .update({ processed: true, processed_at: new Date().toISOString() })
      .eq('id', integrationId);
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    await supabase
      .from('github_integrations')
      .update({ error_message: message })
      .eq('id', integrationId);
    throw err;
  }
}

async function resolveProjectId(
  supabase: SupabaseClient,
  repoFullName: string | undefined,
): Promise<string | null> {
  if (!repoFullName) return null;
  const { data } = await supabase
    .from('projects')
    .select('id')
    .eq('github_repo', repoFullName.toLowerCase())
    .maybeSingle();
  return (data as { id: string } | null)?.id ?? null;
}

async function processIssueEvent(
  supabase: SupabaseClient,
  projectId: string,
  action: string,
  issue: GithubIssue,
  integrationId: number,
): Promise<void> {
  const { data: existing } = await supabase
    .from('tasks')
    .select('id')
    .eq('project_id', projectId)
    .eq('github_issue_number', issue.number)
    .maybeSingle();

  const existingTaskId = (existing as { id: number } | null)?.id ?? null;

  switch (action) {
    case 'opened':
    case 'reopened': {
      if (existingTaskId) {
        await updateTaskFromIssue(supabase, existingTaskId, issue);
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
        await supabase
          .from('tasks')
          .update({
            status: 'done',
            completed_at: new Date().toISOString(),
            last_github_sync_at: new Date().toISOString(),
          })
          .eq('id', existingTaskId);
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
  const { data } = await supabase
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

  return (data as { id: number } | null)?.id ?? null;
}

async function linkPendingTaskToIssue(
  supabase: SupabaseClient,
  taskId: number,
  issue: GithubIssue,
  integrationId: number,
): Promise<void> {
  await updateTaskFromIssue(supabase, taskId, issue);

  await supabase
    .from('tasks')
    .update({
      github_issue_number: issue.number,
      github_issue_url: issue.html_url,
      github_push_pending_at: null,
      synced_from_github: true,
      last_github_sync_at: new Date().toISOString(),
    })
    .eq('id', taskId);

  await supabase
    .from('github_integrations')
    .update({ task_id: taskId })
    .eq('id', integrationId);

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

  const { data: task } = await supabase
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

  if (!task) return;

  const taskId = (task as { id: number }).id;

  await supabase
    .from('github_integrations')
    .update({ task_id: taskId })
    .eq('id', integrationId);

  if (issue.assignees?.length) {
    await syncAssignments(supabase, taskId, issue.assignees);
  }

  await supabase.from('activity_log').insert({
    action: 'created_task_from_github',
    project_id: projectId,
    task_id: taskId,
    metadata: { github_issue_number: issue.number },
  });
}

async function updateTaskFromIssue(
  supabase: SupabaseClient,
  taskId: number,
  issue: GithubIssue,
): Promise<void> {
  await supabase
    .from('tasks')
    .update({
      name: issue.title,
      description: issue.body,
      status: issue.state === 'open' ? 'todo' : 'done',
      priority: extractPriority(issue.labels),
      last_github_sync_at: new Date().toISOString(),
    })
    .eq('id', taskId);
}

async function syncAssignments(
  supabase: SupabaseClient,
  taskId: number,
  assignees: GithubAssignee[],
): Promise<void> {
  // delete then insert — brief gap is fine since the UI uses refetch, not realtime
  await supabase.from('task_assignments').delete().eq('task_id', taskId);

  const usernames = assignees.map((a) => a.login.toLowerCase()).filter(Boolean);
  if (!usernames.length) return;

  const { data: profiles } = await supabase
    .from('profiles')
    .select('id')
    .in('github_username', usernames);

  const matched = (profiles as { id: string }[] | null) ?? [];
  if (!matched.length) return;

  await supabase
    .from('task_assignments')
    .insert(matched.map((p) => ({ task_id: taskId, user_id: p.id, assigned_by: null })));
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

  const { data: task } = await supabase
    .from('tasks')
    .select('id')
    .eq('project_id', projectId)
    .eq('github_issue_number', issueNumber)
    .maybeSingle();

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

  await supabase.from('tasks').update(updates).eq('id', taskId);
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
