import { supabase } from '../supabase/client';
import { Task, TaskAssignment, TaskWithAssignments } from '../types/database';
import { getProfileDisplayName } from '../utils/profileName';
import {
  CreateTaskInput,
  AssignTaskInput,
  TaskOperationResult,
  UpdateTaskInput
} from '../types/tasks';

// Handles all task-related database operations.


/**
 * fetches all tasks for a given project
 */
export async function getTasksByProject(
  projectId: string
): Promise<TaskOperationResult<Task[]>> {
  const { data, error } = await supabase
    .from('tasks')
    .select('*')
    .eq('project_id', projectId)
    .order('sort_order', { ascending: true });

  if (error) {
    console.error('Error fetching tasks:', error);
    return { data: null, error: error.message, success: false };
  }

  return { data: data as Task[], error: null, success: true };
}

/**
 * creates a new task in a specific project
 */
export async function createTask(
  input: CreateTaskInput,
  createdBy: string
): Promise<TaskOperationResult<Task>> {
  const { data, error } = await supabase
    .from('tasks')
    .insert({
      ...input,
      created_by: createdBy,
    })
    .select()
    .single();

  if (error) {
    console.error('Error creating task:', error);
    return { data: null, error: error.message, success: false };
  }

  return { data: data as Task, error: null, success: true };
}

/**
 * assigns users to a task
 */
export async function assignUsersToTask(
  input: AssignTaskInput
): Promise<TaskOperationResult<TaskAssignment[]>> {
  const assignments = input.user_ids.map(userId => ({
    task_id: input.task_id,
    user_id: userId,
    assigned_by: input.assigned_by,
  }));

  const { data, error } = await supabase
    .from('task_assignments')
    .insert(assignments)
    .select();

  if (error) {
    console.error('Error assigning users:', error);
    return { data: null, error: error.message, success: false };
  }

  return { data: data as TaskAssignment[], error: null, success: true };
}

/**
 * fetches tasks with their assignments for a project
 */
export async function getTasksWithAssignments(
  projectId: string
): Promise<TaskOperationResult<TaskWithAssignments[]>> {
  const { data, error } = await supabase
    .from('tasks')
    .select(`
      *,
      assignments:task_assignments (
        id,
        user_id,
        assigned_by,
        assignee:profiles!task_assignments_user_id_fkey (
          id,
          first_name,
          last_name,
          email
        ),
        assigned_by_profile:profiles!task_assignments_assigned_by_fkey (
          id,
          first_name,
          last_name,
          email
        )
      )
    `)
    .eq('project_id', projectId)
    .order('sort_order', { ascending: true });

  if (error) {
    console.error('Error fetching tasks with assignments:', error);
    return { data: null, error: error.message, success: false };
  }

  const tasksWithNames = (data || []).map((task) => ({
    ...task,
    assignments: (task.assignments || []).map((assignment) => ({
      ...assignment,
      assignee: {
        ...assignment.assignee,
        display_name: getProfileDisplayName(assignment.assignee),
      },
      assigned_by_profile: assignment.assigned_by_profile
        ? {
          ...assignment.assigned_by_profile,
          display_name: getProfileDisplayName(assignment.assigned_by_profile),
        }
        : null,
    })),
  }));

  return { data: tasksWithNames as TaskWithAssignments[], error: null, success: true };
}

/**
 * updates an existing task
 */
export async function updateTask(
  taskId: string,
  input: UpdateTaskInput
): Promise<TaskOperationResult<Task>> {
  const { data, error } = await supabase
    .from('tasks')
    .update(input)
    .eq('id', taskId)
    .select()
    .single();

  if (error) {
    console.error('Error updating task:', error);
    return { data: null, error: error.message, success: false };
  }

  return { data: data as Task, error: null, success: true };
}

/**
 * deletes a task and its assignments
 */
export async function deleteTask(
  taskId: string
): Promise<TaskOperationResult<null>> {
  // Delete task assignments first (due to foreign key constraint)
  const { error: assignmentsError } = await supabase
    .from('task_assignments')
    .delete()
    .eq('task_id', taskId);

  if (assignmentsError) {
    console.error('Error deleting task assignments:', assignmentsError);
    return { data: null, error: assignmentsError.message, success: false };
  }

  // Delete the task
  const { error } = await supabase
    .from('tasks')
    .delete()
    .eq('id', taskId);

  if (error) {
    console.error('Error deleting task:', error);
    return { data: null, error: error.message, success: false };
  }

  return { data: null, error: null, success: true };
}