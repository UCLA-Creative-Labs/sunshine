import { createClient } from '@/lib/supabase/server';

/**
 * Check if a user is a project lead for a specific project
 */
export async function isProjectLead(userId: string, projectId: string): Promise<boolean> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('project_members')
    .select('rbac_role:roles!project_members_rbac_role_id_fkey(name)')
    .eq('project_id', projectId)
    .eq('user_id', userId)
    .single();

  if (error || !data) {
    return false;
  }

  // Handle the rbac_role which can be an object or array from Supabase
  const rbacRole = data.rbac_role as unknown;
  let roleName: string | undefined;

  if (rbacRole && typeof rbacRole === 'object' && !Array.isArray(rbacRole)) {
    roleName = (rbacRole as { name?: string }).name;
  }

  return roleName?.toLowerCase() === 'project lead';
}

/**
 * Check if a user is a member of a specific project
 */
export async function isProjectMember(userId: string, projectId: string): Promise<boolean> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('project_members')
    .select('id')
    .eq('project_id', projectId)
    .eq('user_id', userId)
    .single();

  return !error && !!data;
}
