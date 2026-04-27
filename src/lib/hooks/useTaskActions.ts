import { useState } from 'react';
import { updateTask, deleteTask, setTaskAssignees } from '../services/taskService';
import { UpdateTaskInput } from '../types/tasks';
import { TaskStatus } from '../types/database';
import { createActivityLogEntry } from '../supabase/activityService';

interface UpdateTaskActivityContext {
  taskName?: string;
  previousStatus?: TaskStatus;
}

interface DeleteTaskActivityContext {
  taskName?: string;
}

interface UseTaskActionsReturn {
  isUpdating: boolean;
  isDeleting: boolean;
  error: string | null;
  updateTaskAction: (
    taskId: string,
    input: UpdateTaskInput,
    activityContext?: UpdateTaskActivityContext,
  ) => Promise<boolean>;
  deleteTaskAction: (
    taskId: string,
    activityContext?: DeleteTaskActivityContext,
  ) => Promise<boolean>;
  setAssigneesAction: (
    taskId: string,
    userIds: string[],
  ) => Promise<boolean>;
}

export function useTaskActions(
  projectId: string | null,
  currentUserId: string | null,
): UseTaskActionsReturn {
  const [isUpdating, setIsUpdating] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const updateTaskAction = async (
    taskId: string,
    input: UpdateTaskInput,
    activityContext?: UpdateTaskActivityContext,
  ): Promise<boolean> => {
    setIsUpdating(true);
    setError(null);

    const result = await updateTask(taskId, input);

    if (!result.success) {
      setError(result.error || 'Failed to update task');
      setIsUpdating(false);
      return false;
    }

    const changedFields = Object.entries(input)
      .filter(([, value]) => typeof value !== 'undefined')
      .map(([key]) => key);

    if (projectId && currentUserId && changedFields.length > 0) {
      const parsedTaskId = Number(taskId);
      const numericTaskId = Number.isFinite(parsedTaskId)
        ? parsedTaskId
        : undefined;

      const statusChanged =
        input.status &&
        activityContext?.previousStatus &&
        input.status !== activityContext.previousStatus;

      const action =
        statusChanged
          ? input.status === 'done'
            ? 'completed_task'
            : 'updated_task_status'
          : 'updated_task';

      await createActivityLogEntry({
        action,
        projectId,
        userId: currentUserId,
        taskId: numericTaskId,
        metadata: {
          task_name: activityContext?.taskName || '',
          from_status: activityContext?.previousStatus || '',
          to_status: input.status || '',
          changed_fields: changedFields,
        },
      });
    }

    setIsUpdating(false);
    return true;
  };

  const deleteTaskAction = async (
    taskId: string,
    activityContext?: DeleteTaskActivityContext,
  ): Promise<boolean> => {
    setIsDeleting(true);
    setError(null);

    const result = await deleteTask(taskId);

    if (!result.success) {
      setError(result.error || 'Failed to delete task');
      setIsDeleting(false);
      return false;
    }

    if (projectId && currentUserId) {
      await createActivityLogEntry({
        action: 'deleted_task',
        projectId,
        userId: currentUserId,
        metadata: {
          task_name: activityContext?.taskName || '',
        },
      });
    }

    setIsDeleting(false);
    return true;
  };

  const setAssigneesAction = async (
    taskId: string,
    userIds: string[],
  ): Promise<boolean> => {
    if (!currentUserId) {
      setError('Not signed in');
      return false;
    }
    setIsUpdating(true);
    setError(null);

    const numericId = Number(taskId);
    if (!Number.isFinite(numericId)) {
      setError('Invalid task id');
      setIsUpdating(false);
      return false;
    }

    const result = await setTaskAssignees(numericId, userIds, currentUserId);

    setIsUpdating(false);
    if (!result.success) {
      setError(result.error || 'Failed to update assignees');
      return false;
    }
    return true;
  };

  return {
    isUpdating,
    isDeleting,
    error,
    updateTaskAction,
    deleteTaskAction,
    setAssigneesAction,
  };
}
