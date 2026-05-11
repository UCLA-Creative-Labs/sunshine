export type Committee = 'Marketing' | 'Projects' | 'Tech' | 'Finance';

export type ExpenseCategory =
  | 'Food'
  | 'Supplies'
  | 'Project Developer Resources'
  | 'Retreat'
  | 'Other';

export type FinanceRequestStatus = 'Applied' | 'Not yet processed' | 'Processed!';

export interface FinanceRequest {
  id: string;
  name: string;
  event?: string | null;
  expense_category: ExpenseCategory;
  committee: Committee;
  estimated_amount?: number | null;
  exact_amount?: number | null;
  receipt?: string | null;
  how_many_people?: number | null;
  what_will_it_cover?: string | null;
  description: string;
  outcomes: string;
  cost_documentation: string;
  event_date?: string | null;
  event_location?: string | null;
  due_date?: string | null;
  quarter: string;
  status: FinanceRequestStatus;
  notes?: string | null;
  created_by?: string | null;
  created_at: string;
}

export interface CreateFinanceRequest
  extends Omit<FinanceRequest, 'id' | 'created_at' | 'status'> {
  status?: FinanceRequestStatus;
}

export const STATUS_ORDER: FinanceRequestStatus[] = [
  'Applied',
  'Not yet processed',
  'Processed!',
];

export const EXPENSE_CATEGORY_COLORS: Record<string, string> = {
  Food: '#FFE5D6',
  Supplies: '#E5F0FF',
  'Project Developer Resources': '#EFE5FF',
  Retreat: '#E5F9E9',
  Other: '#F3F4F6',
};

export const EXPENSE_CATEGORY_TEXT: Record<string, string> = {
  Food: '#E07A3B',
  Supplies: '#3F86FF',
  'Project Developer Resources': '#7B5BD6',
  Retreat: '#3BB273',
  Other: '#374151',
};

export const COMMITTEE_COLORS: Record<string, string> = {
  Marketing: '#FFE5E5',
  Projects: '#E5F0FF',
  Tech: '#E5F9E9',
  Finance: '#FFF9E5',
};

export const COMMITTEE_TEXT: Record<string, string> = {
  Marketing: '#FF4D4D',
  Projects: '#3F86FF',
  Tech: '#3BB273',
  Finance: '#FFB800',
};
