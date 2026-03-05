import { supabase } from './client';

export interface Profile {
  id: string;
  email: string;
  first_name: string | null;
  last_name: string | null;
  display_name?: string | null;
  created_at: string;
}

export async function getCurrentUserId(): Promise<string | null> {
  const { data: { user } } = await supabase.auth.getUser();
  return user?.id ?? null;
}

export const profileService = {
  async getCurrentProfile() {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('No authenticated user');

    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();

    if (error) throw error;
    return data;
  },

  async getUserRoles(userId: string) {
    const { data, error } = await supabase
      .from('user_context_roles')
      .select(`
        context,
        roles!inner(
          name
        )
      `)
      .eq('user_id', userId);

    if (error) throw error;
    return data;
  },

  async getUserProjects(userId: string) {
    const { data, error } = await supabase
      .from('project_members')
      .select(`
        rbac_role_id,
        joined_at,
        projects (
          id,
          projectName,
          projectDescription,
          projectLeads,
          projectManagers,
          projectMembers,
          year,
          quarter,
          logoUrl,
          prototypeUrl,
          demoDayUrl,
          instaPostUrl
        )
      `)
      .eq('user_id', userId)
      .order('joined_at', { ascending: false });

    if (error) throw error;
    return data || [];
  },

  async getAllProfiles() {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  },

  async updateProfile(id: string, updates: Partial<Profile>) {
    const { data, error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async hasProjectLeadRole(userId: string): Promise<boolean> {
    const { data, error } = await supabase
      .from('project_members')
      .select('roles!inner(name)')
      .eq('user_id', userId);

    if (error) throw error;
    return (data || []).some((m) => {
      const roles = m.roles as { name: string } | { name: string }[];
      if (Array.isArray(roles)) {
        return roles.some((r) => r.name === 'project lead');
      }
      return roles?.name === 'project lead';
    });
  }
};