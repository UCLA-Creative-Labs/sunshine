import { useState, useEffect } from 'react';
import { supabase } from '../supabase/client';

interface UseUserPermissionsReturn {
  permissions: string[];
  isLoading: boolean;
  error: string | null;
  hasPermission: (permission: string) => boolean;
}

/**
 * Hook to fetch and check user's permissions via RBAC system
 */
export function useUserPermissions(userId: string | null): UseUserPermissionsReturn {
  const [permissions, setPermissions] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!userId) {
      setIsLoading(false);
      return;
    }

    const fetchPermissions = async () => {
      setIsLoading(true);
      setError(null);

      const { data, error } = await supabase.rpc('get_user_permissions', {
        p_user_id: userId,
      });

      if (error) {
        setError(error.message);
        setPermissions([]);
      } else {
        setPermissions(data?.map((p: { permission_name: string }) => p.permission_name) || []);
      }

      setIsLoading(false);
    };

    fetchPermissions();
  }, [userId]);

  const hasPermission = (permission: string) => permissions.includes(permission);

  return {
    permissions,
    isLoading,
    error,
    hasPermission,
  };
}
