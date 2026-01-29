import { supabase } from './client';
import { Project } from '@/lib/types/database';

export async function getProjectsByYear(year: string): Promise<Project[]> {
    const { data, error } = await supabase
        .from('projects')
        .select('*')
        .eq('year', year);

    if (error) {
        console.error(`Error fetching projects for year ${year}:`, error);
        return [];
    }

    return (data || []) as Project[];
}

export async function getAllProjects(): Promise<Project[]> {
    const { data, error } = await supabase
        .from('projects')
        .select('*');

    if (error) {
        console.error('Error fetching all projects:', error);
        return [];
    }

    return (data || []) as Project[];
}

export async function getProjectById(projectId: string): Promise<Project | null> {
    const { data, error } = await supabase
        .from('projects')
        .select('*')
        .eq('id', projectId)
        .single();

    if (error || !data) {
        console.error('Error fetching project by ID:', error);
        return null;
    }

    return data as Project;
}

export async function getProjectByUserId(userId: string): Promise<Project | null> {
    const { data, error } = await supabase
        .from('project_members')
        .select('project_id, projects(*)')
        .eq('user_id', userId)
        .single();

    if (error || !data) {
        console.error('Error fetching project for user:', error);
        return null;
    }

    const projectData = data.projects;

    if (!projectData || Array.isArray(projectData)) {
        return null;
    }

    return projectData as unknown as Project;
}
