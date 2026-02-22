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

      // Fetch user's RBAC role from project_members (project-specific)
      const { data: roleData, error: roleError } = await supabase
        .from('project_members')
        .select('rbac_role:roles!project_members_rbac_role_id_fkey(id, name, context, description)')
        .eq('project_id', projectId)
        .eq('user_id', userId)
        .single();

      let projectRole: Role | null = null;
      if (roleError) {
        setError(roleError.message);
        setRole(null);
      } else {
        const fetchedRole = roleData?.rbac_role;
        if (fetchedRole && typeof fetchedRole === 'object' && !Array.isArray(fetchedRole)) {
          projectRole = fetchedRole as Role;
          setRole(projectRole);
        } else {
          setRole(null);
        }
      }

      // Check permissions for the project role
      const roleId = projectRole?.id || null;

      if (roleId) {
        const { data: rolePermissions } = await supabase
          .from('role_permissions')
          .select('permissions(name)')
          .eq('role_id', roleId);

        const permissionNames = (rolePermissions || []).flatMap((entry) => {
          const permissions = entry.permissions as { name?: string } | { name?: string }[] | null | undefined;
          if (Array.isArray(permissions)) {
            return permissions.map((permission) => permission.name).filter(Boolean);
          }
          if (permissions?.name) {
            return [permissions.name];
          }
          return [];
        });

        setCanCreateTasks(permissionNames.includes('project.edit'));
        setCanManageMembers(permissionNames.includes('project.add_member'));
      } else {
        setCanCreateTasks(false);
        setCanManageMembers(false);
      }

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
