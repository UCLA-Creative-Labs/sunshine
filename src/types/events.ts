export type AnnouncementVisibility = 'project' | 'team' | 'board' | 'club_wide';
export type BoardTeam = 'tech' | 'finance' | 'marketing' | 'design' | 'project_managers';

export interface ProjectEvent {
  id: string;
  project_id: string | null;
  title: string;
  description: string | null;
  event_type: string | null;
  event_date: string;
  event_time_display: string | null;
  end_date: string | null;
  location: string | null;
  location_type: string | null;
  virtual_link: string | null;
  rsvp_link: string | null;
  rsvp_required: boolean;
  max_attendees: number | null;
  image_url: string | null;
  status: string;
  is_public: boolean;
  visibility: AnnouncementVisibility;
  target_team: BoardTeam | null;
  created_at: string;
  updated_at: string;
}

export interface ProjectAnnouncement {
  id: string;
  project_id: string | null;
  title: string;
  description: string;
  announcement_type: string | null;
  priority: string;
  is_pinned: boolean;
  show_on_card: boolean;
  image_url: string | null;
  link_url: string | null;
  link_text: string | null;
  publish_date: string;
  expire_date: string | null;
  is_active: boolean;
  visibility: AnnouncementVisibility;
  target_team: BoardTeam | null;
  created_at: string;
  updated_at: string;
}

export type CreateEventInput = Omit<ProjectEvent, 'id' | 'created_at' | 'updated_at'>;
export type CreateAnnouncementInput = Omit<ProjectAnnouncement, 'id' | 'created_at' | 'updated_at'>;
