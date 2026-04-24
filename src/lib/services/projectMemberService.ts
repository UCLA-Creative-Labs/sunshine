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
        created_at,
        major,
        grad_year
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

export async function getExternalRoles(): Promise<Role[]> {
  const { data, error } = await supabase
    .from('roles')
    .select('id, name, context, description, created_at')
    .eq('context', 'external')
    .order('name');

  if (error) {
    console.error('Error fetching external roles:', error);
    return [];
  }
  return (data as Role[]) ?? [];
}

/**
 * Updates an existing project member's RBAC role.
 * @param memberId - The project_members.id (PK, number)
 * @param roleId   - The roles.id to assign
 */
export async function updateMemberRole(
  memberId: number,
  roleId: number
): Promise<TaskOperationResult<void>> {
  const { error } = await supabase
    .from('project_members')
    .update({ rbac_role_id: roleId })
    .eq('id', memberId);

  if (error) {
    console.error('Error updating member role:', error);
    return { data: null, error: error.message, success: false };
  }
  return { data: null, error: null, success: true };
}

/**
 * Removes a member from a project by deleting their project_members row.
 * @param memberId - The project_members.id (PK, number)
 */
export async function removeMember(
  memberId: number
): Promise<TaskOperationResult<void>> {
  const { error } = await supabase
    .from('project_members')
    .delete()
    .eq('id', memberId);

  if (error) {
    console.error('Error removing member:', error);
    return { data: null, error: error.message, success: false };
  }
  return { data: null, error: null, success: true };
}