import { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';

interface UseUserRoleReturn {
  role: 'member' | 'lead' | 'manager' | null;
  isLoading: boolean;
  error: string | null;
  canCreateTasks: boolean;
}

/**
 * hook to get user's role in a specific project
 */
export function useUserRole(projectId: string | null, userId: string | null): UseUserRoleReturn {
  const [role, setRole] = useState<'member' | 'lead' | 'manager' | null>(null);
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
        .select('role')
        .eq('project_id', projectId)
        .eq('user_id', userId)
        .single();

      if (error) {
        setError(error.message);
        setRole(null);
      } else {
        setRole(data?.role || null);
      }

      setIsLoading(false);
    };

    fetchUserRole();
  }, [projectId, userId]);

  const canCreateTasks = role === 'lead' || role === 'manager';

  return {
    role,
    isLoading,
    error,
    canCreateTasks,
  };
}
