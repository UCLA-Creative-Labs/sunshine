export type UserPermission = 'none' | 'member' | 'admin';
export type ProjectRole = 'member' | 'lead' | 'manager';
export type TaskStatus = 'todo' | 'in_progress' | 'in_review' | 'done';
export type TaskPriority = 'low' | 'medium' | 'high' | 'urgent';
export type InviteStatus = 'active' | 'expired' | 'revoked';

export interface Profiles {
  id: string;
  created_at: string;
  email: string;
  display_name: string;
}

export interface Project {
  id: string;
  created_at: string;
  updated_at: string;
  projectName: string;
  projectDescription: string | null;
  projectLeads: string[] | null;
  projectManagers: string[] | null;
  projectMembers: string[] | null;
  year: string;
  quarter: string;
  github_url: string | null;
  figma_url: string | null;
  notion_url: string | null;
  demoDayUrl: string | null;
  instaPostUrl: string | null;
  logo_url: string | null;
  prototype_url: string | null;
  github_repo_owner: string | null;
  github_repo_name: string | null;
  github_installation_id: number | null;
  is_archived: boolean;
}

export interface ProjectMember {
  id: number;
  created_at: string;
  updated_at: string;
  project_id: string;
  user_id: string;
  role: ProjectRole;
  joined_at: string;
  invited_by: string | null;
  invite_id: number | null;
}

export interface Task {
  id: number;
  created_at: string;
  updated_at: string;
  project_id: string;
  parent_task_id: number | null;
  created_by: string | null;
  name: string;
  description: string | null;
  status: TaskStatus;
  priority: TaskPriority;
  points_estimate: number | null;
  due_date: string | null;
  completed_at: string | null;
  github_issue_number: number | null;
  github_pr_number: number | null;
  github_issue_url: string | null;
  github_pr_url: string | null;
  synced_from_github: boolean;
  last_github_sync_at: string | null;
  sort_order: number;
  label: string;
  label_color: string;
}

export interface TaskAssignment {
  id: number;
  created_at: string;
  task_id: number;
  user_id: string;
  assigned_by: string | null;
}

export interface ProjectInvite {
  id: number;
  created_at: string;
  updated_at: string;
  project_id: string;
  created_by: string;
  invite_code: string;
  role_to_assign: ProjectRole;
  status: InviteStatus;
  expires_at: string | null;
  max_uses: number | null;
  times_used: number;
}

export interface GithubIntegration {
  id: number;
  created_at: string;
  project_id: string;
  task_id: number | null;
  delivery_id: string;
  event_type: string;
  action: string;
  github_id: number;
  github_node_id: string | null;
  github_number: number;
  payload: Record<string, any>;
  processed: boolean;
  processed_at: string | null;
  error_message: string | null;
}

export interface ActivityLog {
  id: number;
  created_at: string;
  user_id: string | null;
  action: string;
  project_id: string | null;
  task_id: number | null;
  metadata: Record<string, any> | null;
}

export interface ProjectWithMembers extends Project {
  members: (ProjectMember & { user: Profiles })[];
}

export interface TaskAssignmentWithProfile extends TaskAssignment {
  assignee: Profiles;
  assigned_by_profile: Profiles | null;
}

export interface TaskWithAssignments extends Task {
  assignments: TaskAssignmentWithProfile[];
  subtasks?: Task[];
}

export interface ProjectMemberWithProfile extends ProjectMember {
  user: Profiles;
}
