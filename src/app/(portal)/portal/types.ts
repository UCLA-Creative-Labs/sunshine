// Shared TypeScript interfaces for the membership portal

export interface Member {
  id: string;
  name: string;
  email: string;
  role: string;
  avatarUrl?: string;
  projectId?: string;
}

export interface Project {
  id: string;
  name: string;
  description: string;
  leads: Member[];
  members: Member[];
  status: 'active' | 'completed' | 'on-hold';
  createdAt: Date;
}

export interface Task {
  id: string;
  name: string;
  priority: 'high' | 'medium' | 'low';
  topic: string;
  status: 'in-progress' | 'completed' | 'todo';
  assignee: Member;
  projectId: string;
}

export interface Activity {
  id: string;
  type: 'task_completed' | 'task_added' | 'member_added' | 'project_created';
  description: string;
  actorName: string;
  timestamp: Date;
  relatedTask?: string;
}

export interface Announcement {
  id: string;
  title: string;
  content: string;
  author: Member;
  createdAt: Date;
  priority: 'urgent' | 'normal' | 'info';
}

export interface Event {
  id: string;
  title: string;
  description: string;
  startTime: Date;
  endTime: Date;
  location: string;
  rsvpStatus?: 'attending' | 'maybe' | 'not-attending';
}

export interface QuickLink {
  name: string;
  url: string;
  icon: string;
}
