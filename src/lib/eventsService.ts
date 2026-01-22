import { supabase } from './supabase/client';
import { ProjectEvent, ProjectAnnouncement } from '@/types/events';

/**
 * Get all upcoming events across all projects
 */
export async function getUpcomingEvents(limit?: number): Promise<ProjectEvent[]> {
  const now = new Date().toISOString();

  let query = supabase
    .from('project_events')
    .select('*')
    .eq('is_public', true)
    .eq('status', 'upcoming')
    .gte('event_date', now)
    .order('event_date', { ascending: true });

  if (limit) {
    query = query.limit(limit);
  }

  const { data, error } = await query;

  if (error) {
    console.error('Error fetching upcoming events:', error);
    return [];
  }

  return (data || []) as ProjectEvent[];
}

/**
 * Get events for a specific project
 */
export async function getProjectEvents(
  projectId: string,
  options?: {
    includeCompleted?: boolean;
    limit?: number;
  }
): Promise<ProjectEvent[]> {
  let query = supabase
    .from('project_events')
    .select('*')
    .eq('project_id', projectId)
    .eq('is_public', true)
    .order('event_date', { ascending: true });

  if (!options?.includeCompleted) {
    const now = new Date().toISOString();
    query = query.gte('event_date', now);
  }

  if (options?.limit) {
    query = query.limit(options.limit);
  }

  const { data, error } = await query;

  if (error) {
    console.error('Error fetching project events:', error);
    return [];
  }

  return (data || []) as ProjectEvent[];
}

/**
 * Get all active announcements across all projects
 */
export async function getAllAnnouncements(limit?: number): Promise<ProjectAnnouncement[]> {
  const now = new Date().toISOString();

  let query = supabase
    .from('project_announcements')
    .select('*')
    .eq('is_active', true)
    .lte('publish_date', now)
    .or(`expire_date.is.null,expire_date.gt.${now}`)
    .order('is_pinned', { ascending: false })
    .order('publish_date', { ascending: false });

  if (limit) {
    query = query.limit(limit);
  }

  const { data, error } = await query;

  if (error) {
    console.error('Error fetching announcements:', error);
    return [];
  }

  return (data || []) as ProjectAnnouncement[];
}

/**
 * Get announcements for a specific project
 */
export async function getProjectAnnouncements(
  projectId: string,
  options?: {
    onlyPinned?: boolean;
    onlyShowOnCard?: boolean;
    limit?: number;
  }
): Promise<ProjectAnnouncement[]> {
  const now = new Date().toISOString();

  let query = supabase
    .from('project_announcements')
    .select('*')
    .eq('project_id', projectId)
    .eq('is_active', true)
    .lte('publish_date', now)
    .or(`expire_date.is.null,expire_date.gt.${now}`)
    .order('is_pinned', { ascending: false })
    .order('publish_date', { ascending: false });

  if (options?.onlyPinned) {
    query = query.eq('is_pinned', true);
  }

  if (options?.onlyShowOnCard) {
    query = query.eq('show_on_card', true);
  }

  if (options?.limit) {
    query = query.limit(options.limit);
  }

  const { data, error } = await query;

  if (error) {
    console.error('Error fetching project announcements:', error);
    return [];
  }

  return (data || []) as ProjectAnnouncement[];
}
