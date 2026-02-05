import { useState, useEffect } from 'react';
import { supabase } from '../supabase/client';
import { Role } from '../types/database';

interface UseUserRoleReturn {
  role: Role | null;
  isLoading: boolean;
  error: string | null;
  canCreateTasks: boolean;
  canManageMembers: boolean;
}

/**
 * Hook to get user's role and permissions in a specific project using RBAC system
 */
export function useUserRole(projectId: string | null, userId: string | null): UseUserRoleReturn {
  const [role, setRole] = useState<Role | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [canCreateTasks, setCanCreateTasks] = useState(false);
  const [canManageMembers, setCanManageMembers] = useState(false);

  useEffect(() => {
    if (!projectId || !userId) {
      setIsLoading(false);
      return;
    }

    const fetchUserRole = async () => {
      setIsLoading(true);
      setError(null);

      // Fetch user's RBAC role from user_context_roles
      const { data: roleData, error: roleError } = await supabase
        .from('user_context_roles')
        .select('role:roles(id, name, context, description)')
        .eq('user_id', userId)
        .eq('context', 'external')
        .single();

      if (roleError) {
        setError(roleError.message);
        setRole(null);
      } else {
        const fetchedRole = roleData?.role;
        if (fetchedRole && typeof fetchedRole === 'object' && !Array.isArray(fetchedRole)) {
          setRole(fetchedRole as Role);
        } else {
          setRole(null);
        }
      }

      // Check permissions
      const { data: canEdit } = await supabase.rpc('user_has_permission', {
        p_user_id: userId,
        p_permission_name: 'project.edit',
      });
      setCanCreateTasks(canEdit || false);

      const { data: canManage } = await supabase.rpc('user_has_permission', {
        p_user_id: userId,
        p_permission_name: 'project.add_member',
      });
      setCanManageMembers(canManage || false);

      setIsLoading(false);
    };

    fetchUserRole();
  }, [projectId, userId]);

  return {
    role,
    isLoading,
    error,
    canCreateTasks,
    canManageMembers,
  };
}
