export type Committee = 'Marketing' | 'Projects' | 'Tech' | 'Finance';

export type GraphicType =
  | 'Instagram Post (Single)'
  | 'Instagram Post (Multiple Slides)'
  | 'Instagram Asset'
  | 'Presentation Slides';

export type Publicity = 'External' | 'Internal' | 'Both';

export type Urgency = 'Very urgent! 😵💫' | 'Not urgent 😙' | 'Completed! 🤩';

export type DesignRequestStatus = 'Not started' | 'In progress' | 'Done';

export interface DesignRequest {
  id: string;
  name: string; // The request entry name
  title: string; // Desired title of the graphic
  committee: Committee;
  graphic_type: GraphicType;
  content: string; // What would you like the graphic to communicate?
  location?: string;
  event_date?: string; // ISO string with time
  due_date: string; // ISO date string
  publicity: Publicity;
  quarter: string;
  urgency: Urgency;
  status: DesignRequestStatus;
  notes?: string;
  created_by?: string;
  created_at: string;
}

export interface CreateDesignRequest
  extends Omit<DesignRequest, 'id' | 'created_at' | 'status'> {
  status?: DesignRequestStatus;
}

export const URGENCY_ORDER: Urgency[] = [
  'Not urgent 😙',
  'Very urgent! 😵💫',
  'Completed! 🤩',
];

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
