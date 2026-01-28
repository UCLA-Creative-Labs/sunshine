import { supabase } from '../supabase/client';
import { TaskOperationResult } from '../types/tasks';

export interface UserProject {
  project_id: string;
  role: 'member' | 'lead' | 'manager';
  project_name: string;
}

export async function getUserCurrentProject(
  userId: string
): Promise<TaskOperationResult<UserProject | null>> {
  const { data, error } = await supabase
    .from('project_members')
    .select('project_id, role, projects!project_members_project_id_fkey(projectName)')
    .eq('user_id', userId)
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

  return {
    data: {
      project_id: data.project_id,
      role: data.role as 'member' | 'lead' | 'manager',
      project_name: projectName,
    },
    error: null,
    success: true,
  };
}
