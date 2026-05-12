import { useState } from 'react';
import { Task } from '../types/database';
import {
  AssignTaskInput,
  CreateTaskAssignmentContext,
  CreateTaskInput,
} from '../types/tasks';
import { createTask, assignUsersToTask } from '../services/taskService';
import { createActivityLogEntry } from '../supabase/activityService';

interface UseCreateTaskReturn {
  isCreating: boolean;
  error: string | null;
  createTaskWithAssignees: (
    input: CreateTaskInput,
    createdBy: string,
    assignmentContext: CreateTaskAssignmentContext
  ) => Promise<Task | null>;
}

/**
 * hook for creating tasks with assignees
 */
export function useCreateTask(): UseCreateTaskReturn {
  const [isCreating, setIsCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createTaskWithAssignees = async (
    input: CreateTaskInput,
    createdBy: string,
    assignmentContext: CreateTaskAssignmentContext
  ): Promise<Task | null> => {
    setIsCreating(true);
    setError(null);

    // creates a task from input
    const taskResult = await createTask(input, createdBy);

    if (!taskResult.success || !taskResult.data) {
      setError(taskResult.error || 'Failed to create task');
      setIsCreating(false);
      return null;
    }

    const newTask = taskResult.data;

    await createActivityLogEntry({
      action: 'created_task',
      projectId: input.project_id,
      userId: createdBy,
      taskId: newTask.id,
      metadata: {
        task_name: newTask.name,
        status: newTask.status,
        priority: newTask.priority,
      },
    });

    // assigns users 
    if (assignmentContext.assigneeIds.length > 0) {
      const assignInput: AssignTaskInput = {
        task_id: newTask.id,
        user_ids: assignmentContext.assigneeIds,
        assigned_by: createdBy,
      };

      const assignResult = await assignUsersToTask(assignInput);

      if (!assignResult.success) {
        console.warn('Task created but assignment failed:', assignResult.error);
      } else {
        await createActivityLogEntry({
          action: 'task_assigned',
          projectId: input.project_id,
          userId: createdBy,
          taskId: newTask.id,
          metadata: {
            task_name: newTask.name,
            assignee_count: assignmentContext.assigneeIds.length,
            assignee_names: assignmentContext.assigneeDisplayNames,
            assignee_summary: assignmentContext.assigneeDisplayNames.join(', '),
            message: assignmentContext.assignmentNote || '',
          },
        });
      }
    }

    fetch('/api/github/create-issue', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ taskId: newTask.id }),
    }).catch((err) => {
      console.error('Auto-push to github failed:', err);
    });

    setIsCreating(false);
    return newTask;
  };

  return {
    isCreating,
    error,
    createTaskWithAssignees,
  };
}
