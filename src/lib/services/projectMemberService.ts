import { supabase } from '../supabase/client';
import { ProjectMember, Profiles, Role } from '../types/database';
import { getProfileDisplayName } from '../utils/profileName';
import { TaskOperationResult } from '../types/tasks';

export interface ProjectMemberWithProfile extends ProjectMember {
  user: Profiles;
  rbac_role?: Role;
}

export async function getProjectMembers(
  projectId: string
): Promise<TaskOperationResult<ProjectMemberWithProfile[]>> {
  const { data, error } = await supabase
    .from('project_members')
    .select(`
      *,
      user:profiles!project_members_user_id_fkey (
        id,
        email,
        first_name,
        last_name,
        created_at
      ),
      rbac_role:roles!project_members_rbac_role_id_fkey (
        id,
        name,
        context,
        description,
        created_at
      )
    `)
    .eq('project_id', projectId);

  if (error) {
    console.error('Error fetching project members:', error);
    return { data: null, error: error.message, success: false };
  }

  const membersWithRoles = (data || []).map(member => ({
    ...member,
    rbac_role: member.rbac_role as Role | undefined,
    user: {
      ...member.user,
      display_name: getProfileDisplayName(member.user),
    },
  }));

  return { data: membersWithRoles as ProjectMemberWithProfile[], error: null, success: true };
}