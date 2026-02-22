'use client';

import { useState } from 'react';
import { use } from 'react';
import { useAuth } from '@/lib/hooks/useAuth';
import { useUserRole } from '@/lib/hooks/useUserRole';
import { useProjectMembers } from '@/lib/hooks/useProjectMembers';
import InviteMemberModal from '@/components/portal/InviteMemberModal';

function getRoleBadgeStyles(roleName: string | undefined) {
  if (!roleName) return 'bg-gray-100 text-gray-600';
  
  const lowerName = roleName.toLowerCase();
  if (lowerName.includes('lead')) {
    return 'bg-purple-100 text-purple-700';
  }
  if (lowerName.includes('manager') || lowerName.includes('admin')) {
    return 'bg-blue-100 text-blue-700';
  }
  return 'bg-gray-100 text-gray-600';
}

export default function MembersPage({
  params,
}: {
  params: Promise<{ projectId: string }>;
}) {
  const { projectId } = use(params);
  const { userId, isLoading: authLoading, error: authError } = useAuth();
  const { canManageMembers } = useUserRole(projectId, userId);
  const { members, isLoading: membersLoading, refetch } = useProjectMembers(projectId);
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);

  if (authLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <p className="text-sm text-black/50">Loading...</p>
      </div>
    );
  }

  if (authError || !userId) {
    return (
      <div className="flex items-center justify-center py-12">
        <p className="text-sm text-red-500">Please sign in to view this page</p>
      </div>
    );
  }

  return (
    <>
      <section className="space-y-2">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl md:text-4xl font-semibold tracking-tight">
            Members
          </h1>
          {canManageMembers && (
            <button
              onClick={() => setIsInviteModalOpen(true)}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              Add Members
            </button>
          )}
        </div>
      </section>

      <section className="mt-6">
        {membersLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500" />
          </div>
        ) : members.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            No members in this project yet
          </div>
        ) : (
          <div className="bg-white rounded-lg border border-[#CDCCC8] overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-[#CDCCC8]">
                <tr>
                  <th className="text-left px-4 py-3 text-sm font-medium text-gray-600">
                    Name
                  </th>
                  <th className="text-left px-4 py-3 text-sm font-medium text-gray-600">
                    Email
                  </th>
                  <th className="text-left px-4 py-3 text-sm font-medium text-gray-600">
                    Role
                  </th>
                  <th className="text-left px-4 py-3 text-sm font-medium text-gray-600">
                    Joined
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#CDCCC8]">
                {members.map((member) => (
                  <tr key={member.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center text-sm font-medium text-gray-600">
                          {member.user.display_name?.charAt(0).toUpperCase() || '?'}
                        </div>
                        <span className="font-medium text-gray-900">
                          {member.user.display_name}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-gray-600">
                      {member.user.email}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-block px-2 py-1 text-xs font-medium rounded capitalize ${getRoleBadgeStyles(member.rbac_role?.name)}`}
                      >
                        {member.rbac_role?.name || 'No role'}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-gray-500 text-sm">
                      {new Date(member.joined_at).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      <InviteMemberModal
        projectId={projectId}
        currentUserId={userId}
        isOpen={isInviteModalOpen}
        onClose={() => setIsInviteModalOpen(false)}
        onSuccess={() => refetch()}
      />
    </>
  );
}
