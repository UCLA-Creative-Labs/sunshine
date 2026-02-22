import { supabase } from '../supabase/client';
import { Profiles } from '../types/database';
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
    .select('id, email, display_name, created_at');

  if (existingUserIds.length > 0) {
    query = query.not('id', 'in', `(${existingUserIds.join(',')})`);
  }

  const { data, error } = await query;

  if (error) {
    console.error('Error fetching available members:', error);
    return { data: null, error: error.message, success: false };
  }

  return { data: data as AvailableMember[], error: null, success: true };
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

  // Add user_context_roles entries for each new member
  if (finalRoleId) {
    const userContextRoles = userIds.map(userId => ({
      user_id: userId,
      role_id: finalRoleId,
      context: 'external' as const,
    }));

    const { error: roleError } = await supabase
      .from('user_context_roles')
      .insert(userContextRoles)
      .select();

    if (roleError) {
      console.error('Error adding user context roles:', roleError);
      // Don't fail the whole operation, just log the error
    }
  }

  return { data: data.length, error: null, success: true };
}

export async function removeMemberFromProject(
  projectId: string,
  userId: string
): Promise<TaskOperationResult<boolean>> {
  // Remove from user_context_roles
  const { error: roleError } = await supabase
    .from('user_context_roles')
    .delete()
    .eq('user_id', userId)
    .eq('context', 'external');

  if (roleError) {
    console.error('Error removing user context role:', roleError);
    // Continue with project_members deletion
  }

  // Remove from project_members
  const { error } = await supabase
    .from('project_members')
    .delete()
    .eq('project_id', projectId)
    .eq('user_id', userId);

  if (error) {
    console.error('Error removing member from project:', error);
    return { data: false, error: error.message, success: false };
  }

  return { data: true, error: null, success: true };
}
