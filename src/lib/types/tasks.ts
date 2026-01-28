import { TaskStatus, TaskPriority } from './database';

/**
 * input type for creating a new task
 */
export interface CreateTaskInput {
  project_id: string;
  name: string;
  description: string;
  status: TaskStatus;
  priority: TaskPriority;
  due_date: string; // ISO date string
  label: string;
  label_color: string;
  // Optional fields
  parent_task_id?: number;
  points_estimate?: number;
}

/**
 * input type for assigning users to a task
 */
export interface AssignTaskInput {
  task_id: number;
  user_ids: string[];
  assigned_by: string;
}

/**
 * input type for updating an existing task
 */
export interface UpdateTaskInput {
  name?: string;
  description?: string;
  status?: TaskStatus;
  priority?: TaskPriority;
  due_date?: string;
  label?: string;
  label_color?: string;
  parent_task_id?: number;
  points_estimate?: number;
}

/**
 * ui-only validated input 
 */
export interface CreateTaskFormState {
  name: string;
  description: string;
  status: TaskStatus;
  priority: TaskPriority;
  due_date: string; // yyyy-mm-dd from <input type="date">
  label: string;
  label_color: string;
  assignee_ids: string[];
}

/**
 * result type for task operations.
 */
export interface TaskOperationResult<T> {
  data: T | null;
  error: string | null;
  success: boolean;
}

/**
 *  label options for the UI.
 */
export const TASK_LABELS = [
  { name: 'Bug', color: '#FFE6D5' },
  { name: 'Feature', color: '#E2F7E6' },
  { name: 'UX', color: '#FFF1C2' },
  { name: 'Backend', color: '#E5F3FF' },
  { name: 'Frontend', color: '#ECE3FF' },
  { name: 'Documentation', color: '#F3E8FF' },
] as const;