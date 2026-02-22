'use client';

import { useState } from 'react';
import { useInviteMembers } from '@/lib/hooks/useInviteMembers';

interface InviteMemberModalProps {
  projectId: string;
  currentUserId: string;
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export default function InviteMemberModal({
  projectId,
  currentUserId,
  isOpen,
  onClose,
  onSuccess,
}: InviteMemberModalProps) {
  const [selectedRoleId, setSelectedRoleId] = useState<number | null>(null);

  const {
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
    availableRoles,
    rolesLoading,
  } = useInviteMembers(projectId, currentUserId);

  if (!isOpen) return null;

  const handleInvite = async () => {
    // Use selected RBAC role, or default to 'project member'
    const success = await inviteMembers(selectedRoleId || undefined);
    if (success) {
      onSuccess?.();
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="absolute inset-0 bg-black/50"
        onClick={onClose}
      />

      <div className="relative bg-white rounded-lg shadow-xl w-full max-w-md mx-4 max-h-[80vh] flex flex-col">
        <div className="p-4 border-b border-[#CDCCC8]">
          <h2 className="text-lg font-semibold">Add Members to Project</h2>
          <p className="text-sm text-gray-500 mt-1">
            Select members to add to this project
          </p>
        </div>

        <div className="p-4 border-b border-[#CDCCC8]">
          <input
            type="text"
            placeholder="Search by name or email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="flex-1 overflow-y-auto p-4">
          {loading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500" />
            </div>
          ) : error ? (
            <div className="text-red-500 text-center py-4">{error}</div>
          ) : filteredMembers.length === 0 ? (
            <div className="text-gray-500 text-center py-8">
              {searchQuery
                ? 'No members match your search'
                : 'All members are already in this project'}
            </div>
          ) : (
            <div className="space-y-2">
              <div className="flex justify-between items-center mb-3 pb-2 border-b">
                <span className="text-sm text-gray-500">
                  {selectedUserIds.length} selected
                </span>
                <div className="space-x-2">
                  <button
                    onClick={selectAll}
                    className="text-sm text-blue-600 hover:underline"
                  >
                    Select All
                  </button>
                  <button
                    onClick={clearSelection}
                    className="text-sm text-gray-500 hover:underline"
                  >
                    Clear
                  </button>
                </div>
              </div>

              {filteredMembers.map((member) => (
                <label
                  key={member.id}
                  className="flex items-center p-3 rounded-lg hover:bg-gray-50 cursor-pointer border border-transparent hover:border-gray-200"
                >
                  <input
                    type="checkbox"
                    checked={selectedUserIds.includes(member.id)}
                    onChange={() => toggleUserSelection(member.id)}
                    className="h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                  />
                  <div className="ml-3 flex-1">
                    <p className="font-medium text-gray-900">
                      {member.display_name}
                    </p>
                    <p className="text-sm text-gray-500">{member.email}</p>
                  </div>
                </label>
              ))}
            </div>
          )}
        </div>

        <div className="p-4 border-t border-[#CDCCC8] space-y-3">
          <div className="flex items-center gap-3">
            <label className="text-sm font-medium text-gray-700">
              Role:
            </label>
            {rolesLoading ? (
              <div className="text-sm text-gray-500">Loading roles...</div>
            ) : (
              <select
                value={selectedRoleId || ''}
                onChange={(e) => setSelectedRoleId(e.target.value ? Number(e.target.value) : null)}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Default (Project Member)</option>
                {availableRoles.map((role) => (
                  <option key={role.id} value={role.id}>
                    {role.name}
                  </option>
                ))}
              </select>
            )}
          </div>

          <div className="flex justify-end gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-md transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleInvite}
              disabled={selectedUserIds.length === 0 || inviting}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {inviting
                ? 'Adding...'
                : `Add ${selectedUserIds.length} Member${selectedUserIds.length !== 1 ? 's' : ''}`}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
