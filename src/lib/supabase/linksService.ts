import { createClient } from './client';

export interface Link {
  id: string;
  display_name: string;
  url: string;
  redirect_path: string;
  created_by: string | null;
  created_at: string;
}

export interface CreateLinkPayload {
  display_name: string;
  url: string;
  redirect_path: string;
  created_by?: string | null;
}

/**
 * Fetches all links ordered by creation date (oldest first).
 */
export async function getLinks(): Promise<Link[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('links')
    .select('*')
    .order('created_at', { ascending: true });

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
 * NOTE: Requires an INSERT RLS policy on public.links for authenticated users.
 * Suggested policy:
 *   CREATE POLICY "Authenticated users can insert links"
 *   ON public.links FOR INSERT TO authenticated
 *   WITH CHECK (auth.uid() = created_by);
 */
export async function createLink(payload: CreateLinkPayload): Promise<Link> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('links')
    .insert([payload])
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
