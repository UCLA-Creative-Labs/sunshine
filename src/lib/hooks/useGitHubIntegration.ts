import { useState, useEffect, useCallback } from 'react';

interface PATStatus {
  hasPAT: boolean;
  updatedAt: string | null;
  githubUrl: string | null;
}

interface UseGitHubIntegrationReturn {
  patStatus: PATStatus | null;
  isLoading: boolean;
  error: string | null;
  savePAT: (pat: string) => Promise<{ success: boolean; error?: string }>;
  removePAT: () => Promise<{ success: boolean; error?: string }>;
  refreshStatus: () => Promise<void>;
}

export function useGitHubIntegration(projectId: string | null): UseGitHubIntegrationReturn {
  const [patStatus, setPatStatus] = useState<PATStatus | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchStatus = useCallback(async () => {
    if (!projectId) return;

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/projects/${projectId}/github/pat`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error ?? 'Failed to fetch GitHub status');
      }

      setPatStatus(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setIsLoading(false);
    }
  }, [projectId]);

  useEffect(() => {
    fetchStatus();
  }, [fetchStatus]);

  const savePAT = useCallback(async (pat: string): Promise<{ success: boolean; error?: string }> => {
    if (!projectId) {
      return { success: false, error: 'No project selected' };
    }

    try {
      const response = await fetch(`/api/projects/${projectId}/github/pat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pat }),
      });

      const data = await response.json();

      if (!response.ok) {
        return { success: false, error: data.error ?? 'Failed to save PAT' };
      }

      await fetchStatus();
      return { success: true };
    } catch (err) {
      return { success: false, error: err instanceof Error ? err.message : 'Unknown error' };
    }
  }, [projectId, fetchStatus]);

  const removePAT = useCallback(async (): Promise<{ success: boolean; error?: string }> => {
    if (!projectId) {
      return { success: false, error: 'No project selected' };
    }

    try {
      const response = await fetch(`/api/projects/${projectId}/github/pat`, {
        method: 'DELETE',
      });

      const data = await response.json();

      if (!response.ok) {
        return { success: false, error: data.error ?? 'Failed to remove PAT' };
      }

      await fetchStatus();
      return { success: true };
    } catch (err) {
      return { success: false, error: err instanceof Error ? err.message : 'Unknown error' };
    }
  }, [projectId, fetchStatus]);

  return {
    patStatus,
    isLoading,
    error,
    savePAT,
    removePAT,
    refreshStatus: fetchStatus,
  };
}
