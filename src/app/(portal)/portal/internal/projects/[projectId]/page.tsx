'use client';

import { useEffect, useState } from 'react';
import { useProjectMembers } from '@/lib/hooks/useProjectMembers';
import { updateMemberRole, removeMember } from '@/lib/services/projectMemberService';
import { getProjectById } from '@/lib/supabase/projectService';
import { supabase } from '@/lib/supabase/client';
import InviteMemberModal from '@/components/portal/InviteMemberModal';
import { Project } from '@/types/project';
import { Role } from '@/lib/types/database';

interface ProjectMemberPageProps {
  params: {
    projectId: string;
  };
}

export default function ProjectMemberPage({ params }: ProjectMemberPageProps) {
  const { projectId } = params;

  const { members, isLoading, refetch } = useProjectMembers(projectId);
  const [project, setProject] = useState<Project | null>(null);
  const [projectNotFound, setProjectNotFound] = useState(false);
  const [currentUserId, setCurrentUserId] = useState<string>('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [savingRoleId, setSavingRoleId] = useState<number | null>(null);
  const [confirmRemoveId, setConfirmRemoveId] = useState<number | null>(null);
  const [roles, setRoles] = useState<Role[]>([]);
  const [rowErrors, setRowErrors] = useState<Record<number, string>>({});

  // Load project info, current user, and available roles on mount
  useEffect(() => {
    getProjectById(projectId).then((data) => {
      if (data) {
        setProject(data);
      } else {
        setProjectNotFound(true);
      }
    });

    supabase.auth.getUser().then(({ data }) => {
      if (data.user) {
        setCurrentUserId(data.user.id);
      }
    });

    supabase
      .from('roles')
      .select('id, name, context, description, created_at')
      .eq('context', 'external')
      .order('name')
      .then(({ data }) => {
        if (data) setRoles(data as Role[]);
      });
  }, [projectId]);

  const handleRoleChange = async (memberId: number, roleId: number) => {
    setSavingRoleId(memberId);
    setRowErrors((prev) => ({ ...prev, [memberId]: '' }));
    const result = await updateMemberRole(memberId, roleId);
    setSavingRoleId(null);
    if (result.success) {
      await refetch();
    } else {
      setRowErrors((prev) => ({
        ...prev,
        [memberId]: result.error || 'Failed to update role',
      }));
    }
  };

  const handleRemoveConfirm = async (memberId: number) => {
    const result = await removeMember(memberId);
    if (result.success) {
      setConfirmRemoveId(null);
      await refetch();
    } else {
      setRowErrors((prev) => ({
        ...prev,
        [memberId]: result.error || 'Failed to remove member',
      }));
      setConfirmRemoveId(null);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold text-gray-900">
        {projectNotFound ? 'Project not found' : project?.projectName ?? ''}
      </h1>

      <div className="rounded-2xl border border-[#D4D7E5] bg-white shadow-lg overflow-hidden">
        {/* Card header */}
        <div className="flex items-center justify-between px-6 py-4">
          <span className="text-lg font-semibold text-gray-900">Members</span>
          <button
            onClick={() => setIsModalOpen(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm"
          >
            Add Member
          </button>
        </div>

        <div className="border-b border-[#D4D7E5]" />

        {/* Card body */}
        <div className="py-6 px-6">
          {members.length === 0 ? (
            <div className="flex flex-col items-center gap-4 py-6">
              <p className="text-gray-500 text-sm">No members yet</p>
              <button
                onClick={() => setIsModalOpen(true)}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm"
              >
                Add Member
              </button>
            </div>
          ) : (
            <table className="w-full">
              <thead>
                <tr>
                  <th className="text-sm text-gray-500 font-medium px-4 py-3 text-left w-[40%]">
                    Name / Email
                  </th>
                  <th className="text-sm text-gray-500 font-medium px-4 py-3 text-left w-[30%]">
                    Role
                  </th>
                  <th className="text-sm text-gray-500 font-medium px-4 py-3 text-left w-[30%]">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {members.map((member) => (
                  <tr key={member.id} className="border-t border-[#D4D7E5]">
                    {/* Name / Email cell */}
                    <td className="px-4 py-3">
                      <p className="font-medium text-gray-900">
                        {member.user.display_name || member.user.email}
                      </p>
                      <p className="text-sm text-gray-500">{member.user.email}</p>
                    </td>

                    {/* Role cell */}
                    <td className="px-4 py-3">
                      {savingRoleId === member.id ? (
                        <span className="text-sm text-gray-500">Saving...</span>
                      ) : (
                        <select
                          value={member.rbac_role_id ?? ''}
                          onChange={(e) =>
                            handleRoleChange(member.id, Number(e.target.value))
                          }
                          className="text-sm border border-gray-300 rounded-md px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                          {roles.map((role) => (
                            <option key={role.id} value={role.id}>
                              {role.name}
                            </option>
                          ))}
                        </select>
                      )}
                      {rowErrors[member.id] && (
                        <p className="text-sm text-red-500 mt-1">
                          {rowErrors[member.id]}
                        </p>
                      )}
                    </td>

                    {/* Actions cell */}
                    <td className="px-4 py-3">
                      {confirmRemoveId === member.id ? (
                        <span className="flex items-center gap-2 text-sm">
                          <span className="text-gray-700">
                            Remove {member.user.display_name || member.user.email}?
                          </span>
                          <button
                            onClick={() => handleRemoveConfirm(member.id)}
                            className="text-red-600 hover:text-red-800 font-medium"
                          >
                            Yes
                          </button>
                          <button
                            onClick={() => setConfirmRemoveId(null)}
                            className="text-gray-500 hover:text-gray-700"
                          >
                            Cancel
                          </button>
                        </span>
                      ) : (
                        <button
                          onClick={() => setConfirmRemoveId(member.id)}
                          className="text-sm text-red-600 hover:text-red-800"
                        >
                          Remove
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      <InviteMemberModal
        projectId={projectId}
        currentUserId={currentUserId}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={() => refetch()}
      />
    </div>
  );
}
