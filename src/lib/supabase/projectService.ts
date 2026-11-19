import { supabase } from './client';
import { Project } from '@/types/project';
import { parseGithubRepo } from '@/lib/github/parseRepo';

export const INVALID_GITHUB_URL_MESSAGE = 'Enter a GitHub repository URL, e.g. https://github.com/org/repo';

export interface ProjectSettingsUpdate {
  projectName?: string;
  githubUrl?: string | null;
  github_repo?: string | null;
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
 * Creates a new project in the database.
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
  const finalUpdates: any = { ...updates };

  if ('githubUrl' in updates) {
    const url = updates.githubUrl;
    let githubRepo: string | null = null;
    if (url) {
      githubRepo = parseGithubRepo(url);
      // invalid input must not unlink the repo
      if (!githubRepo) throw new Error(INVALID_GITHUB_URL_MESSAGE);
    }
    finalUpdates.github_repo = githubRepo;
  }

  const { data, error } = await supabase
    .from('projects')
    .update(finalUpdates)
    .eq('id', projectId)
    .select('*')
    .single();

  if (error || !data) {
    console.error('Error updating project settings:', error ? { ...error, message: error.message, stack: (error as Error).stack } : 'error object was null');
    return null;
  }

  return data as Project;
}


const LOGO_TYPE_TO_EXT: Record<string, string> = {
  'image/png': 'png',
  'image/jpeg': 'jpg',
  'image/svg+xml': 'svg',
};
export const ALLOWED_LOGO_TYPES = ['image/png', 'image/jpeg', 'image/svg+xml'];

export async function uploadProjectLogo(
  projectId: string,
  file: File,
  bucketName = 'project_logos'
): Promise<string | null> {
  if (!ALLOWED_LOGO_TYPES.includes(file.type)) {
    console.error(`Invalid File Type, type=${file.type}`);
    return null;
  }
  const maxLogoSize: number = 5 * 1024 * 1024;
  if (file.size > maxLogoSize) {
    console.error(`File too big, size=${file.size}`);
    return null;
  }
  const fileExt = LOGO_TYPE_TO_EXT[file.type];
  const fileName = `logo-${Date.now()}.${fileExt}`;
  const filePath = `${projectId}/${fileName}`;

  const { error: uploadError } = await supabase
    .storage
    .from(bucketName)
    .upload(filePath, file, { cacheControl: '3600', upsert: true, contentType: file.type });

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
