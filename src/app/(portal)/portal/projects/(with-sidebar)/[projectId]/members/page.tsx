'use client';

import { use, useMemo, useState } from 'react';
import { FaPlus, FaEnvelope } from 'react-icons/fa6';
import { useAuth } from '@/lib/hooks/useAuth';
import { useUserRole } from '@/lib/hooks/useUserRole';
import { useProjectMembers } from '@/lib/hooks/useProjectMembers';
import InviteMemberModal from '@/components/portal/InviteMemberModal';
import {
  Avatar,
  Badge,
  Button,
  pickAvatarColor,
  type BadgeColor,
} from '@/components/portal/ui';
import type { ProjectMemberWithProfile } from '@/lib/services/projectMemberService';

function roleToBadge(roleName: string | undefined): { color: BadgeColor; label: string } {
  if (!roleName) return { color: 'ink', label: 'No role' };
  const n = roleName.toLowerCase();
  if (n.includes('lead')) return { color: 'blue', label: roleName };
  if (n.includes('manager') || n.includes('admin')) return { color: 'pink', label: roleName };
  if (n.includes('design')) return { color: 'mint', label: roleName };
  if (n.includes('engineer') || n.includes('dev')) return { color: 'lime', label: roleName };
  return { color: 'ink', label: roleName };
}

function roleRank(roleName: string | undefined): number {
  if (!roleName) return 99;
  const n = roleName.toLowerCase();
  if (n.includes('lead')) return 0;
  if (n.includes('manager') || n.includes('admin')) return 1;
  return 2;
}

function formatJoined(dateString: string): string {
  const d = new Date(dateString);
  return d.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
}

function MemberCard({ member }: { member: ProjectMemberWithProfile }) {
  const name = member.user.display_name ?? 'Unknown';
  const email = member.user.email;
  const major = member.user.major ?? undefined;
  const gradYear = member.user.grad_year != null ? String(member.user.grad_year) : undefined;
  const school = [major, gradYear].filter(Boolean).join(' · ');
  const badge = roleToBadge(member.rbac_role?.name);
  const color = pickAvatarColor(name);

  return (
    <div className="group flex flex-col gap-3 rounded-2xl border-[1.5px] border-ink-200 bg-white p-5 shadow-card transition-all duration-fast ease-out hover:-translate-y-0.5 hover:border-ink-400 hover:shadow-card-hover">
      <div className="flex items-start gap-3">
        <Avatar name={name} color={color} size="lg" />
        <div className="min-w-0 flex-1">
          <p className="truncate font-display text-[18px] font-bold leading-tight text-ink-900">
            {name}
          </p>
          {school && (
            <p className="mt-0.5 truncate text-[13px] text-ink-600">{school}</p>
          )}
          <p className="mt-0.5 truncate font-code text-[11px] text-ink-400">
            <FaEnvelope className="mr-1.5 inline h-2.5 w-2.5 text-ink-400" />
            {email}
          </p>
        </div>
      </div>

      <div className="flex items-center justify-between gap-2 border-t border-ink-100 pt-3">
        <Badge color={badge.color} className="capitalize">
          {badge.label}
        </Badge>
        <span className="font-code text-[10px] uppercase tracking-[0.06em] text-ink-400">
          since {formatJoined(member.joined_at)}
        </span>
      </div>
    </div>
  );
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

  const sortedMembers = useMemo(() => {
    return [...members].sort((a, b) => {
      const r = roleRank(a.rbac_role?.name) - roleRank(b.rbac_role?.name);
      if (r !== 0) return r;
      return (a.user.display_name ?? '').localeCompare(b.user.display_name ?? '');
    });
  }, [members]);

  if (authLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <p className="font-accent italic text-[14px] text-ink-400">loading…</p>
      </div>
    );
  }

  if (authError || !userId) {
    return (
      <div className="flex items-center justify-center py-12">
        <p className="text-sm text-cl-danger-700">Please sign in to view this page</p>
      </div>
    );
  }

  return (
    <>
      <section className="flex items-center justify-between gap-3">
        <div className="flex flex-col gap-1">
          <span className="font-code text-[11px] uppercase tracking-[0.08em] text-ink-400">
            team roster
          </span>
          <h1 className="font-display text-[32px] font-bold leading-tight tracking-[-0.01em] text-ink-900 md:text-[40px]">
            Members
            <span className="ml-3 font-code text-[14px] font-normal uppercase tracking-[0.06em] text-ink-400">
              {sortedMembers.length} {sortedMembers.length === 1 ? 'person' : 'people'}
            </span>
          </h1>
        </div>
        {canManageMembers && (
          <Button
            variant="primary"
            size="md"
            leadingIcon={<FaPlus className="h-3 w-3" />}
            onClick={() => setIsInviteModalOpen(true)}
          >
            Invite
          </Button>
        )}
      </section>

      <section className="mt-8">
        {membersLoading ? (
          <div className="flex items-center justify-center py-12">
            <p className="font-accent italic text-[14px] text-ink-400">loading roster…</p>
          </div>
        ) : sortedMembers.length === 0 ? (
          <div className="rounded-2xl border-[1.5px] border-dashed border-ink-300 bg-transparent px-5 py-12 text-center">
            <p className="font-accent italic text-[15px] text-ink-400">
              no members yet —
            </p>
            <p className="mt-1 text-[14px] text-ink-600">
              {canManageMembers
                ? 'invite teammates to get started'
                : 'ask a project lead to invite teammates'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {sortedMembers.map((member) => (
              <MemberCard key={member.id} member={member} />
            ))}
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
