import { useState, useEffect, useCallback } from 'react';
import { getUserCurrentProject, UserProject } from '../services/userProjectService';

interface UseUserProjectReturn {
  project: UserProject | null;
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export function useUserProject(userId: string | null): UseUserProjectReturn {
  const [project, setProject] = useState<UserProject | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProject = useCallback(async () => {
    if (!userId) {
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);

    const result = await getUserCurrentProject(userId);

    if (result.success) {
      setProject(result.data);
    } else {
      setError(result.error);
    }

    setIsLoading(false);
  }, [userId]);

  useEffect(() => {
    fetchProject();
  }, [fetchProject]);

  return {
    project,
    isLoading,
    error,
    refetch: fetchProject,
  };
}
