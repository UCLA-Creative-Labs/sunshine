import { supabase } from './client';
import { Project } from '@/types/project';

export interface ProjectSettingsUpdate {
  projectName?: string;
  githubUrl?: string | null;
  figmaUrl?: string | null;
  notionUrl?: string | null;
  logoUrl?: string | null;
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

/**
 * Fetches a project by its ID.
 * @param projectId - The project ID to look up
 * @returns The project or null if not found
 */
export async function getProjectById(projectId: string): Promise<Project | null> {
    const { data, error } = await supabase
        .from('projects')
        .select('*')
        .eq('id', projectId)
        .single();

    if (error || !data) {
        console.error('Error fetching project by id:', error);
        return null;
    }

    return data as unknown as Project;
}

/**
 * Fetches the project associated with a user via the project_members join table.
 * @param userId - The user ID to look up
 * @returns The user's project or null if not found
 */
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

    // The joined projects data is nested under the 'projects' key
    const projectData = data.projects;

    if (!projectData || Array.isArray(projectData)) {
        return null;
    }

    return projectData as unknown as Project;
}

/**
 * Creates a new project in the database.
 * @param project - The project data without the id (auto-generated)
 * @returns The created project or null if creation failed
 */
export async function createProject(project: Omit<Project, 'id'>): Promise<Project | null> {
    const { data, error } = await supabase
        .from('projects')
        .insert(project)
        .select()
        .single();

    if (error) {
        console.error('Error creating project:', error);
        throw new Error(error.message);
    }

    return data as Project;
}

/**
 * Updates an existing project in the database.
 * @param projectId - The ID of the project to update
 * @param updates - The partial project data to update
 * @returns The updated project or null if update failed
 */
export async function updateProject(projectId: number, updates: Partial<Project>): Promise<Project | null> {
    const { data, error } = await supabase
        .from('projects')
        .update(updates)
        .eq('id', projectId)
        .select()
        .single();

    if (error) {
        console.error('Error updating project:', error);
        throw new Error(error.message);
    }

    return data as Project;
}

export async function updateProjectSettings(
  projectId: string,
  updates: ProjectSettingsUpdate
): Promise<Project | null> {
  const { data, error } = await supabase
    .from('projects')
    .update(updates)
    .eq('id', projectId)
    .select('*')
    .single();

  if (error || !data) {
    console.error('Error updating project settings:', error);
    return null;
  }

  return data as Project;
}

export async function uploadProjectLogo(
  projectId: string,
  file: File,
  bucketName = 'project_logos'
): Promise<string | null> {
  const fileExt = file.name.split('.').pop() || 'png';
  const fileName = `logo-${Date.now()}.${fileExt}`;
  const filePath = `${projectId}/${fileName}`;

  const { error: uploadError } = await supabase
    .storage
    .from(bucketName)
    .upload(filePath, file, { cacheControl: '3600', upsert: true });

  if (uploadError) {
    console.error('Error uploading project logo:', uploadError);
    return null;
  }

  const { data: publicUrl } = supabase
    .storage
    .from(bucketName)
    .getPublicUrl(filePath);

  return publicUrl?.publicUrl || null;
}
