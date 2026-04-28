import type { SupabaseClient } from '@supabase/supabase-js';

export type AccessResult = { allowed: boolean; reason?: string };

export async function userHasProjectEdit(
  userId: string,
  projectId: string,
  supabase: SupabaseClient,
): Promise<boolean> {
  const { data: memberRow, error: memberErr } = await supabase
    .from('project_members')
    .select('rbac_role_id')
    .eq('project_id', projectId)
    .eq('user_id', userId)
    .single();

  if (memberErr || !memberRow?.rbac_role_id) {
    return false;
  }

  const { data: rolePermissions, error: permErr } = await supabase
    .from('role_permissions')
    .select('permissions(name)')
    .eq('role_id', memberRow.rbac_role_id);

  if (permErr || !rolePermissions) {
    return false;
  }

  const permissionNames = rolePermissions.flatMap((entry: { permissions: unknown }) => {
    const permissions = entry.permissions as
      | { name?: string }
      | { name?: string }[]
      | null
      | undefined;
    if (Array.isArray(permissions)) {
      return permissions.map((p) => p.name).filter(Boolean) as string[];
    }
    if (permissions?.name) {
      return [permissions.name];
    }
    return [];
  });

  return permissionNames.includes('project.edit');
}

export async function userCanActOnTaskIssue(
  userId: string,
  taskId: number | string,
  projectId: string,
  supabase: SupabaseClient,
): Promise<AccessResult> {
  const { data: assignmentRow } = await supabase
    .from('task_assignments')
    .select('task_id')
    .eq('task_id', taskId)
    .eq('user_id', userId)
    .maybeSingle();

  if (assignmentRow) {
    return { allowed: true };
  }

  const hasEdit = await userHasProjectEdit(userId, projectId, supabase);
  if (hasEdit) {
    return { allowed: true };
  }

  return {
    allowed: false,
    reason:
      'You are not an assignee on this task and do not have edit permission on this project.',
  };
}
