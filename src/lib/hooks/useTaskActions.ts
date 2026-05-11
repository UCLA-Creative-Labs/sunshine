import { useState } from 'react';
import { updateTask, deleteTask } from '../services/taskService';
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
  isPushingToGithub: boolean;
  error: string | null;
  updateTaskAction: (
    taskId: string,
    input: UpdateTaskInput,
    activityContext?: UpdateTaskActivityContext,
    hasGithubIssue?: boolean,
  ) => Promise<boolean>;
  deleteTaskAction: (
    taskId: string,
    activityContext?: DeleteTaskActivityContext,
    hasGithubIssue?: boolean,
  ) => Promise<boolean>;
  pushToGithubAction: (taskId: string) => Promise<boolean>;
}

export function useTaskActions(
  projectId: string | null,
  currentUserId: string | null,
): UseTaskActionsReturn {
  const [isUpdating, setIsUpdating] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isPushingToGithub, setIsPushingToGithub] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const updateTaskAction = async (
    taskId: string,
    input: UpdateTaskInput,
    activityContext?: UpdateTaskActivityContext,
    hasGithubIssue?: boolean,
  ): Promise<boolean> => {
    setIsUpdating(true);
    setError(null);

    const result = await updateTask(taskId, input);

    if (!result.success) {
      setError(result.error || 'Failed to update task');
      setIsUpdating(false);
      return false;
    }

    if (hasGithubIssue) {
      try {
        await fetch('/api/github/update-issue', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ taskId }),
        });
      } catch (err) {
        console.error('Error syncing update to github:', err);
      }
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
    hasGithubIssue?: boolean,
  ): Promise<boolean> => {
    setIsDeleting(true);
    setError(null);

    const result = await deleteTask(taskId);

    if (!result.success) {
      setError(result.error || 'Failed to delete task');
      setIsDeleting(false);
      return false;
    }

    if (hasGithubIssue) {
      fetch('/api/github/close-issue', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ taskId }),
      }).catch((err) => {
        console.error('Error closing github issue:', err);
      });
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

  const pushToGithubAction = async (taskId: string): Promise<boolean> => {
    setIsPushingToGithub(true);
    setError(null);

    try {
      const res = await fetch('/api/github/create-issue', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ taskId }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Failed to push to GitHub');
        setIsPushingToGithub(false);
        return false;
      }

      setIsPushingToGithub(false);
      return true;
    } catch (e: any) {
      setError(e.message || 'An unexpected error occurred during GitHub push');
      setIsPushingToGithub(false);
      return false;
    }
  };

  return {
    isUpdating,
    isDeleting,
    isPushingToGithub,
    error,
    updateTaskAction,
    deleteTaskAction,
    pushToGithubAction,
  };
}