export type RoleContext = 'internal' | 'external';

export interface Role {
  id: number;
  context: RoleContext;
  name: string;
  description: string | null;
  created_at: string;
}

export interface Permission {
  id: number;
  name: string;
  description: string | null;
}

export interface RolePermission {
  role_id: number;
  permission_id: number;
  role?: Role;
  permission?: Permission;
}

export interface UserContextRole {
  user_id: string;
  role_id: number;
  context: RoleContext;
  role?: Role;
}

// ============================================================================
// LEGACY TYPES (Deprecated - use RBAC system instead)
// ============================================================================

export type TaskStatus = 'todo' | 'in_progress' | 'in_review' | 'done';
export type TaskPriority = 'low' | 'medium' | 'high' | 'urgent';
export type InviteStatus = 'active' | 'expired' | 'revoked';
export type { Project } from '@/types/project';
import { Project } from '@/types/project';

export interface Profiles {
  id: string;
  created_at: string;
  email: string;
  display_name: string;
}

export interface ProjectMember {
  id: number;
  created_at: string;
  updated_at: string;
  project_id: string;
  user_id: string;
  rbac_role_id: number | null;
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
  rbac_role_id: number | null;
  status: InviteStatus;
  expires_at: string | null;
  max_uses: number | null;
  times_used: number;
}

// export interface GithubIntegration {
//   id: number;
//   created_at: string;
//   project_id: string;
//   task_id: number | null;
//   delivery_id: string;
//   event_type: string;
//   action: string;
//   github_id: number;
//   github_node_id: string | null;
//   github_number: number;
//   payload: Record<string, any>;
//   processed: boolean;
//   processed_at: string | null;
//   error_message: string | null;
// }

// export interface ActivityLog {
//   id: number;
//   created_at: string;
//   user_id: string | null;
//   action: string;
//   project_id: string | null;
//   task_id: number | null;
//   metadata: Record<string, any> | null;
// }

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
