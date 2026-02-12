import { useState, useEffect } from 'react';
import { supabase } from '../supabase/client';

type ProjectRole = 'project lead' | 'project member' | null;

interface UseUserRoleReturn {
  role: ProjectRole;
  isLoading: boolean;
  error: string | null;
  canCreateTasks: boolean;
  canPostEvents: boolean;
}

/**
 * hook to get user's role in a specific project
 * joins project_members with roles table via rbac_role_id
 */
export function useUserRole(projectId: string | null, userId: string | null): UseUserRoleReturn {
  const [role, setRole] = useState<ProjectRole>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!projectId || !userId) {
      setIsLoading(false);
      return;
    }

    const fetchUserRole = async () => {
      setIsLoading(true);
      setError(null);

      const { data, error } = await supabase
        .from('project_members')
        .select(`
          rbac_role_id,
          roles!inner(name)
        `)
        .eq('project_id', projectId)
        .eq('user_id', userId)
        .single();

      if (error) {
        setError(error.message);
        setRole(null);
      } else {
        const roles = data?.roles as unknown as { name: string } | { name: string }[] | null;
        const roleName = Array.isArray(roles) ? roles[0]?.name : roles?.name ?? null;
        setRole(roleName as ProjectRole);
      }

      setIsLoading(false);
    };

    fetchUserRole();
  }, [projectId, userId]);

  const canCreateTasks = role === 'project lead';
  const canPostEvents = role === 'project lead';

  return {
    role,
    isLoading,
    error,
    canCreateTasks,
    canPostEvents,
  };
}
