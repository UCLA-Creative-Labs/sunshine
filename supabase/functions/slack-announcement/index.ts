import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { createAnnouncementHandler } from './handler.ts';
import type { Announcement } from './handler.ts';

// Created only after the handler authenticates the webhook.
function serviceClient() {
  const url = Deno.env.get('SUPABASE_URL');
  const key = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
  if (!url || !key) throw new Error('Supabase service credentials are not configured');
  return createClient(url, key, { auth: { persistSession: false, autoRefreshToken: false } });
}

serve(createAnnouncementHandler({
  env: (name) => Deno.env.get(name),
  async getAnnouncement(id) {
    const { data, error } = await serviceClient()
      .from('project_announcements')
      .select('title, description, visibility, project_id, target_team, link_url, priority')
      .eq('id', id)
      .maybeSingle();
    if (error) throw error;
    return data as Announcement | null;
  },
  async getProjectChannel(id) {
    const { data, error } = await serviceClient()
      .from('projects')
      .select('slack_channel_id')
      .eq('id', id)
      .maybeSingle();
    if (error) throw error;
    return data?.slack_channel_id ?? null;
  },
  fetch,
}));
