import { useState } from 'react';
import { Task } from '../types/database';
import { CreateTaskInput, AssignTaskInput } from '../types/tasks';
import { createTask, assignUsersToTask } from '../services/taskService';

interface UseCreateTaskReturn {
  isCreating: boolean;
  error: string | null;
  createTaskWithAssignees: (
    input: CreateTaskInput,
    createdBy: string,
    assigneeIds: string[]
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
    assigneeIds: string[]
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

    // assigns users 
    if (assigneeIds.length > 0) {
      const assignInput: AssignTaskInput = {
        task_id: newTask.id,
        user_ids: assigneeIds,
        assigned_by: createdBy,
      };

      const assignResult = await assignUsersToTask(assignInput);

      if (!assignResult.success) {
        console.warn('Task created but assignment failed:', assignResult.error);
      }
    }

    setIsCreating(false);
    return newTask;
  };

  return {
    isCreating,
    error,
    createTaskWithAssignees,
  };
}