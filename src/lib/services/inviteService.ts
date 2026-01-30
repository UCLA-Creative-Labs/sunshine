import { supabase } from '../supabase/client';
import { Profiles, ProjectRole } from '../types/database';
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

export async function addMembersToProject(
  projectId: string,
  userIds: string[],
  role: ProjectRole,
  invitedBy: string
): Promise<TaskOperationResult<number>> {
  if (userIds.length === 0) {
    return { data: 0, error: 'No users selected', success: false };
  }

  const membersToInsert = userIds.map(userId => ({
    project_id: projectId,
    user_id: userId,
    role,
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

export async function removeMemberFromProject(
  projectId: string,
  userId: string
): Promise<TaskOperationResult<boolean>> {
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
