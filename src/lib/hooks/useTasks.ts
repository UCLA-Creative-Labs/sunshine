import { useState, useEffect, useCallback } from 'react';
import { TaskWithAssignments } from '../types/database';
import { getTasksWithAssignments } from '../services/taskService';

interface UseTasksReturn {
  tasks: TaskWithAssignments[];
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

/**
 * Hook for fetching and managing tasks for a project.
 */

// TODO: make sure this protected so only project members  can access pages using this hook
// I reccomend something like a frontend guard protection
export function useTasks(projectId: string | null): UseTasksReturn {
  const [tasks, setTasks] = useState<TaskWithAssignments[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTasks = useCallback(async () => {
    if (!projectId) {
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);

    const result = await getTasksWithAssignments(projectId);

    if (result.success) {
      setTasks(result.data || []);
    } else {
      setError(result.error);
    }

    setIsLoading(false);
  }, [projectId]);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  return {
    tasks,
    isLoading,
    error,
    refetch: fetchTasks,
  };
}