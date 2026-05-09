import { createClient } from './client';
import { FinanceRequest, CreateFinanceRequest } from '@/types/financeRequest';

export async function createFinanceRequest(request: CreateFinanceRequest) {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('finance_requests')
    .insert([request])
    .select()
    .single();

  if (error) {
    console.error('Error creating finance request:', error);
    throw error;
  }
  return data as FinanceRequest;
}

export async function getFinanceRequests() {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('finance_requests')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching finance requests:', error);
    throw error;
  }
  return data as FinanceRequest[];
}

export async function updateFinanceRequest(
  id: string,
  updates: Partial<FinanceRequest>
) {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('finance_requests')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error('Error updating finance request:', error);
    throw error;
  }
  return data as FinanceRequest;
}
