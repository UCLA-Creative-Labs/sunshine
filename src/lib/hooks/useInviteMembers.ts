import { useState, useEffect, useCallback } from 'react';
import {
  getAvailableMembers,
  addMembersToProject,
  AvailableMember,
} from '../services/inviteService';
import { Role } from '../types/database';
import { supabase } from '../supabase/client';

interface UseInviteMembersReturn {
  availableMembers: AvailableMember[];
  loading: boolean;
  error: string | null;
  selectedUserIds: string[];
  toggleUserSelection: (userId: string) => void;
  selectAll: () => void;
  clearSelection: () => void;
  inviteMembers: (roleId?: number) => Promise<boolean>;
  inviting: boolean;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  filteredMembers: AvailableMember[];
  refresh: () => void;
  availableRoles: Role[];
  rolesLoading: boolean;
}

export function useInviteMembers(
  projectId: string,
  currentUserId: string
): UseInviteMembersReturn {
  const [availableMembers, setAvailableMembers] = useState<AvailableMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedUserIds, setSelectedUserIds] = useState<string[]>([]);
  const [inviting, setInviting] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [availableRoles, setAvailableRoles] = useState<Role[]>([]);
  const [rolesLoading, setRolesLoading] = useState(true);

  const fetchMembers = useCallback(async () => {
    setLoading(true);
    setError(null);

    const result = await getAvailableMembers(projectId);

    if (result.success && result.data) {
      setAvailableMembers(result.data);
    } else {
      setError(result.error || 'Failed to fetch available members');
    }

    setLoading(false);
  }, [projectId]);

  const fetchRoles = useCallback(async () => {
    setRolesLoading(true);
    const { data, error } = await supabase
      .from('roles')
      .select('id, name, context, description')
      .eq('context', 'external')
      .order('name');

    if (error) {
      console.error('Error fetching roles:', error);
    } else {
      setAvailableRoles(data as Role[] || []);
    }
    setRolesLoading(false);
  }, []);

  useEffect(() => {
    fetchMembers();
    fetchRoles();
  }, [fetchMembers, fetchRoles]);

  const toggleUserSelection = useCallback((userId: string) => {
    setSelectedUserIds(prev =>
      prev.includes(userId)
        ? prev.filter(id => id !== userId)
        : [...prev, userId]
    );
  }, []);

  const selectAll = useCallback(() => {
    setSelectedUserIds(availableMembers.map(m => m.id));
  }, [availableMembers]);

  const clearSelection = useCallback(() => {
    setSelectedUserIds([]);
  }, []);

  const inviteMembers = useCallback(
    async (roleId?: number): Promise<boolean> => {
      if (selectedUserIds.length === 0) return false;

      setInviting(true);
      const result = await addMembersToProject(
        projectId,
        selectedUserIds,
        currentUserId,
        roleId
      );
      setInviting(false);

      if (result.success) {
        setSelectedUserIds([]);
        await fetchMembers();
        return true;
      }

      setError(result.error || 'Failed to invite members');
      return false;
    },
    [projectId, selectedUserIds, currentUserId, fetchMembers]
  );

  const filteredMembers = availableMembers.filter(member => {
    const query = searchQuery.toLowerCase();
    return (
      (member.display_name?.toLowerCase().includes(query) ?? false) ||
      member.email.toLowerCase().includes(query)
    );
  });

  return {
    availableMembers,
    loading,
    error,
    selectedUserIds,
    toggleUserSelection,
    selectAll,
    clearSelection,
    inviteMembers,
    inviting,
    searchQuery,
    setSearchQuery,
    filteredMembers,
    refresh: fetchMembers,
    availableRoles,
    rolesLoading,
  };
}
