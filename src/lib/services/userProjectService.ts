import { supabase } from '../supabase/client';
import { TaskOperationResult } from '../types/tasks';
import { Role } from '../types/database';

export interface UserProject {
  project_id: string;
  role: Role | null;
  project_name: string;
}

export async function getUserCurrentProject(
  userId: string
): Promise<TaskOperationResult<UserProject | null>> {
  // Fetch the most recently joined project membership, with its RBAC role
  const { data, error } = await supabase
    .from('project_members')
    .select('project_id, projects!project_members_project_id_fkey(projectName), rbac_role:roles!project_members_rbac_role_id_fkey(id, name, context, description)')
    .eq('user_id', userId)
    .order('joined_at', { ascending: false, nullsFirst: false })
    .order('id', { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error) {
    console.error('Error fetching user project:', error);
    return { data: null, error: error.message, success: false };
  }

  if (!data) {
    return { data: null, error: null, success: true };
  }

  const projects = data.projects as any;
  const projectName = projects?.projectName || 'Unknown Project';

  const fetchedRole = data.rbac_role;
  const userRole = (fetchedRole && typeof fetchedRole === 'object' && !Array.isArray(fetchedRole))
    ? fetchedRole as Role
    : null;

  return {
    data: {
      project_id: data.project_id,
      role: userRole,
      project_name: projectName,
    },
    error: null,
    success: true,
  };
}
