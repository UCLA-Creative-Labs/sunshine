import { createClient } from './client';

export interface Link {
  id: string;
  display_name: string;
  url: string;
  redirect_path: string;
  created_by: string | null;
  created_at: string;
  position: number;
}

export interface CreateLinkPayload {
  display_name: string;
  url: string;
  redirect_path: string;
  created_by?: string | null;
  position?: number;
}

/**
 * Fetches all links ordered by position.
 */
export async function getLinks(): Promise<Link[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('links')
    .select('*')
    .order('position', { ascending: false });

  if (error) {
    console.error('Error fetching links:', error);
    throw error;
  }
  return (data ?? []) as Link[];
}

/**
 * Checks whether a redirect_path is already taken.
 * Returns true if it is taken, false if it's free.
 */
export async function isRedirectPathTaken(redirectPath: string): Promise<boolean> {
  const supabase = createClient();
  const { data } = await supabase
    .from('links')
    .select('id')
    .eq('redirect_path', redirectPath)
    .maybeSingle();
  return !!data;
}

/**
 * Inserts a new link row.
 * Automatically assigns the next position if not provided.
 */
export async function createLink(payload: CreateLinkPayload): Promise<Link> {
  const supabase = createClient();

  const finalPayload = { ...payload };

  // If position is not provided, find the max position and add 1
  if (finalPayload.position === undefined) {
    const { data: maxPosData } = await supabase
      .from('links')
      .select('position')
      .order('position', { ascending: false })
      .limit(1)
      .maybeSingle();
    
    finalPayload.position = (maxPosData?.position ?? -1) + 1;
  }

  const { data, error } = await supabase
    .from('links')
    .insert([finalPayload])
    .select()
    .single();

  if (error) {
    console.error('Error creating link:', error);
    throw error;
  }
  return data as Link;
}

/**
 * Updates an existing link.
 */
export async function updateLink(id: string, updates: Partial<CreateLinkPayload>): Promise<Link> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('links')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error('Error updating link:', error);
    throw error;
  }
  return data as Link;
}

/**
 * Deletes a link by ID.
 */
export async function deleteLink(id: string): Promise<void> {
  const supabase = createClient();
  const { error } = await supabase
    .from('links')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Error deleting link:', error);
    throw error;
  }
}
/**
 * Batch updates the positions of multiple links.
 */
export async function updateLinkPositions(updates: { id: string, position: number }[]): Promise<void> {
  const supabase = createClient();
  
  // Note: For small numbers of links, individual updates are fine.
  // For larger sets, a stored procedure (RPC) would be better.
  const promises = updates.map(u => 
    supabase
      .from('links')
      .update({ position: u.position })
      .eq('id', u.id)
  );

  const results = await Promise.all(promises);
  const error = results.find(r => r.error)?.error;

  if (error) {
    console.error('Error updating link positions:', error);
    throw error;
  }
}
