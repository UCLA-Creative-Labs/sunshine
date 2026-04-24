import { createClient } from '@/lib/supabase/server';

/**
 * Access rules for project workspace routes (board/list/members/settings/overview):
 * - Project directors (internal role whose name contains both "project" and "director") see every project.
 * - Anyone listed in project_members for that project sees it.
 * - Everyone else is blocked — the read-only detail lives in the directory modal.
 */

export async function isProjectDirector(userId: string): Promise<boolean> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('user_context_roles')
    .select('roles:roles!inner(name, context)')
    .eq('user_id', userId)
    .eq('context', 'internal');

  if (error || !data) return false;

  for (const row of data) {
    const role = (row as any).roles as { name?: string } | { name?: string }[] | null;
    const name = Array.isArray(role) ? role[0]?.name : role?.name;
    if ((name ?? '').trim().toLowerCase() === 'project director') return true;
  }
  return false;
}

export async function isProjectMember(userId: string, projectId: string): Promise<boolean> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('project_members')
    .select('user_id')
    .eq('user_id', userId)
    .eq('project_id', projectId)
    .limit(1);

  if (error || !data) return false;
  return data.length > 0;
}

export async function canAccessProject(userId: string, projectId: string): Promise<boolean> {
  const [director, member] = await Promise.all([
    isProjectDirector(userId),
    isProjectMember(userId, projectId),
  ]);
  return director || member;
}
