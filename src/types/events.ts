export interface ProjectEvent {
  id: string;
  project_id: string;
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
  created_at: string;
  updated_at: string;
}

export interface ProjectAnnouncement {
  id: string;
  project_id: string;
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
  created_at: string;
  updated_at: string;
}
