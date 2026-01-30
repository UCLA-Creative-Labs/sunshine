import { useState, useEffect, useCallback } from 'react';
import {
  getAvailableMembers,
  addMembersToProject,
  AvailableMember,
} from '../services/inviteService';
import { ProjectRole } from '../types/database';

interface UseInviteMembersReturn {
  availableMembers: AvailableMember[];
  loading: boolean;
  error: string | null;
  selectedUserIds: string[];
  toggleUserSelection: (userId: string) => void;
  selectAll: () => void;
  clearSelection: () => void;
  inviteMembers: (role: ProjectRole) => Promise<boolean>;
  inviting: boolean;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  filteredMembers: AvailableMember[];
  refresh: () => void;
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

  useEffect(() => {
    fetchMembers();
  }, [fetchMembers]);

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
    async (role: ProjectRole): Promise<boolean> => {
      if (selectedUserIds.length === 0) return false;

      setInviting(true);
      const result = await addMembersToProject(
        projectId,
        selectedUserIds,
        role,
        currentUserId
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
      member.display_name.toLowerCase().includes(query) ||
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
  };
}
