import { useState } from 'react';
import { updateTask, deleteTask } from '../services/taskService';
import { UpdateTaskInput } from '../types/tasks';

interface UseTaskActionsReturn {
  isUpdating: boolean;
  isDeleting: boolean;
  error: string | null;
  updateTaskAction: (taskId: string, input: UpdateTaskInput) => Promise<boolean>;
  deleteTaskAction: (taskId: string) => Promise<boolean>;
}

export function useTaskActions(): UseTaskActionsReturn {
  const [isUpdating, setIsUpdating] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const updateTaskAction = async (taskId: string, input: UpdateTaskInput): Promise<boolean> => {
    setIsUpdating(true);
    setError(null);

    const result = await updateTask(taskId, input);

    if (!result.success) {
      setError(result.error || 'Failed to update task');
      setIsUpdating(false);
      return false;
    }

    setIsUpdating(false);
    return true;
  };

  const deleteTaskAction = async (taskId: string): Promise<boolean> => {
    setIsDeleting(true);
    setError(null);

    const result = await deleteTask(taskId);

    if (!result.success) {
      setError(result.error || 'Failed to delete task');
      setIsDeleting(false);
      return false;
    }

    setIsDeleting(false);
    return true;
  };

  return {
    isUpdating,
    isDeleting,
    error,
    updateTaskAction,
    deleteTaskAction,
  };
}
