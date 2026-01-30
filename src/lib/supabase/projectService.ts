import { supabase } from './client';
import { Project } from '@/lib/types/database';
import { Project as FeProject } from '@/types/project';

function fromDbToFe(dbProject: Project): FeProject {
  // Super simple string hash, not guaranteed to be unique
  const feId = dbProject.id.split('').reduce((acc, char) => {
    acc = ((acc << 5) - acc) + char.charCodeAt(0);
    return acc & acc;
  }, 0);

  return {
    id: feId,
    year: dbProject.year,
    quarter: dbProject.quarter,
    projectName: dbProject.projectName,
    projectLeads: dbProject.projectLeads || [],
    projectDescription: dbProject.projectDescription || '',
    projectManagers: dbProject.projectManagers || [],
    projectMembers: dbProject.projectMembers || [],
    logoUrl: dbProject.logo_url || '',
    prototypeUrl: dbProject.prototype_url || '',
    demoDayUrl: dbProject.demoDayUrl || '',
    instaPostUrl: dbProject.instaPostUrl || '',
  };
}

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

export async function getProjectsByYearFe(year: string): Promise<FeProject[]> {
    const { data, error } = await supabase
        .from('projects')
        .select('*')
        .eq('year', year);

    if (error) {
        console.error(`Error fetching projects for year ${year}:`, error);
        return [];
    }

    return (data || []).map(fromDbToFe);
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

export async function getAllProjectsFe(): Promise<FeProject[]> {
    const { data, error } = await supabase
        .from('projects')
        .select('*');

    if (error) {
        console.error('Error fetching all projects:', error);
        return [];
    }

    return (data || []).map(fromDbToFe);
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

export async function getProjectByUserId(userId:string): Promise<Project | null> {
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
