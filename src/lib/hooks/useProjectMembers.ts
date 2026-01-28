import { useState, useEffect, useCallback } from 'react';
import { getProjectMembers, ProjectMemberWithProfile } from '../services/projectMemberService';

interface UseProjectMembersReturn {
  members: ProjectMemberWithProfile[];
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

/**
 * hook for fetching project members
 */
export function useProjectMembers(projectId: string | null): UseProjectMembersReturn {
  const [members, setMembers] = useState<ProjectMemberWithProfile[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchMembers = useCallback(async () => {
    if (!projectId) {
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);

    const result = await getProjectMembers(projectId);

    if (result.success) {
      setMembers(result.data || []);
    } else {
      setError(result.error);
    }

    setIsLoading(false);
  }, [projectId]);

  useEffect(() => {
    fetchMembers();
  }, [fetchMembers]);

  return {
    members,
    isLoading,
    error,
    refetch: fetchMembers,
  };
}
