import { supabase } from '../supabase/client';
import { ProjectMember, Profiles } from '../types/database';
import { TaskOperationResult } from '../types/tasks';

export interface ProjectMemberWithProfile extends ProjectMember {
  user: Profiles;
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
        display_name,
        created_at
      )
    `)
    .eq('project_id', projectId);

  if (error) {
    console.error('Error fetching project members:', error);
    return { data: null, error: error.message, success: false };
  }

  const members = data?.map(member => ({
    ...member,
    user: {
      ...member.user,
      display_name: member.user.display_name || member.user.email?.split('@')[0] || 'Unknown',
    }
  })) || [];

  return { data: members as ProjectMemberWithProfile[], error: null, success: true };
}