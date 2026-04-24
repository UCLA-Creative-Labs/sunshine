import { createClient } from './client';
import { DesignRequest, CreateDesignRequest } from '@/types/designRequest';

export async function createDesignRequest(request: CreateDesignRequest) {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('design_requests')
    .insert([request])
    .select()
    .single();

  if (error) {
    console.error('Error creating design request:', error);
    throw error;
  }
  return data as DesignRequest;
}

export async function getDesignRequests() {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('design_requests')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching design requests:', error);
    throw error;
  }
  return data as DesignRequest[];
}

export async function updateDesignRequest(
  id: string,
  updates: Partial<DesignRequest>
) {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('design_requests')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error('Error updating design request:', error);
    throw error;
  }
  return data as DesignRequest;
}
