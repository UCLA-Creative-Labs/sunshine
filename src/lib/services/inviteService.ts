import { supabase } from '../supabase/client';
import { Profiles } from '../types/database';
import { getProfileDisplayName } from '../utils/profileName';
import { TaskOperationResult } from '../types/tasks';

export type AvailableMember = Profiles;

export async function getAvailableMembers(
  projectId: string
): Promise<TaskOperationResult<AvailableMember[]>> {
  const { data: existingMembers, error: membersError } = await supabase
    .from('project_members')
    .select('user_id')
    .eq('project_id', projectId);

  if (membersError) {
    console.error('Error fetching existing members:', membersError);
    return { data: null, error: membersError.message, success: false };
  }

  const existingUserIds = existingMembers?.map(m => m.user_id) || [];

  let query = supabase
    .from('profiles')
    .select('id, email, first_name, last_name, created_at');

  if (existingUserIds.length > 0) {
    query = query.not('id', 'in', `(${existingUserIds.join(',')})`);
  }

  const { data, error } = await query;

  if (error) {
    console.error('Error fetching available members:', error);
    return { data: null, error: error.message, success: false };
  }

  const membersWithNames = (data || []).map((member) => ({
    ...member,
    display_name: getProfileDisplayName(member),
  }));

  return { data: membersWithNames as AvailableMember[], error: null, success: true };
}

/**
 * Add members to project with RBAC role assignment
 * @param roleId - The RBAC role ID to assign (optional, defaults to 'project member' role)
 */
export async function addMembersToProject(
  projectId: string,
  userIds: string[],
  invitedBy: string,
  roleId?: number
): Promise<TaskOperationResult<number>> {
  if (userIds.length === 0) {
    return { data: 0, error: 'No users selected', success: false };
  }

  // If no roleId provided, fetch the default 'project member' role
  let finalRoleId = roleId;
  if (!finalRoleId) {
    const { data: defaultRole } = await supabase
      .from('roles')
      .select('id')
      .eq('context', 'external')
      .eq('name', 'project member')
      .single();

    finalRoleId = defaultRole?.id;
  }

  const membersToInsert = userIds.map(userId => ({
    project_id: projectId,
    user_id: userId,
    rbac_role_id: finalRoleId,
    invited_by: invitedBy,
    joined_at: new Date().toISOString(),
  }));

  const { data, error } = await supabase
    .from('project_members')
    .insert(membersToInsert)
    .select();

  if (error) {
    console.error('Error adding members to project:', error);
    return { data: null, error: error.message, success: false };
  }

  return { data: data.length, error: null, success: true };
}
