import { supabase } from './client';
import { getProfileDisplayName } from '@/lib/utils/profileName';

type JsonPrimitive = string | number | boolean | null;
type JsonValue = JsonPrimitive | JsonValue[] | { [key: string]: JsonValue };

interface ActivityLogProfile {
  id: string;
  email: string;
  first_name: string | null;
  last_name: string | null;
  created_at: string;
}

interface ActivityLogRow {
  id: number;
  created_at: string;
  user_id: string | null;
  action: string;
  project_id: string | null;
  task_id: number | null;
  metadata: Record<string, JsonValue> | null;
  user: ActivityLogProfile | ActivityLogProfile[] | null;
}

export interface ActivityLogEntry {
  id: number;
  created_at: string;
  user_id: string | null;
  action: string;
  project_id: string | null;
  task_id: number | null;
  metadata: Record<string, JsonValue> | null;
  actor: ActivityLogProfile | null;
  actorDisplayName: string;
}

export interface CreateActivityLogInput {
  action: string;
  projectId: string;
  userId: string | null;
  taskId?: number | null;
  metadata?: Record<string, JsonValue> | null;
}

export async function getProjectActivityLog(
  projectId: string,
  limit = 10,
): Promise<ActivityLogEntry[]> {
  const { data, error } = await supabase
    .from('activity_log')
    .select(`
      id,
      created_at,
      user_id,
      action,
      project_id,
      task_id,
      metadata,
      user:profiles!activity_log_user_id_fkey (
        id,
        email,
        first_name,
        last_name,
        created_at
      )
    `)
    .eq('project_id', projectId)
    .order('created_at', { ascending: false })
    .limit(limit);

  if (error) {
    console.error('Error fetching project activity log:', error);
    return [];
  }

  return (((data || []) as unknown) as ActivityLogRow[]).map((item) => {
    const actor = Array.isArray(item.user) ? item.user[0] || null : item.user;

    return {
      id: item.id,
      created_at: item.created_at,
      user_id: item.user_id,
      action: item.action,
      project_id: item.project_id,
      task_id: item.task_id,
      metadata: item.metadata,
      actor,
      actorDisplayName: getProfileDisplayName(actor),
    };
  });
}

export async function createActivityLogEntry(
  input: CreateActivityLogInput,
): Promise<boolean> {
  if (!input.action.trim()) {
    return false;
  }

  const { error } = await supabase.from('activity_log').insert({
    action: input.action.trim(),
    project_id: input.projectId,
    user_id: input.userId,
    task_id: input.taskId ?? null,
    metadata: input.metadata ?? {},
  });

  if (error) {
    // Recent activity should never break core flows like creating events.
    console.warn('Unable to write activity log entry:', error.message);
    return false;
  }

  return true;
}
