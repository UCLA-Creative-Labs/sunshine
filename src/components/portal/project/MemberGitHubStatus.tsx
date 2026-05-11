'use client';

import React, { useEffect, useState } from 'react';
import { FaCheckCircle, FaSpinner } from 'react-icons/fa';
import { useUserRole } from '@/lib/hooks/useUserRole';

interface MemberGitHubStatusProps {
    projectId: string;
    userId: string;
    currentUserId: string;
}

type statusTypes = 'collaborator' | 'not_collaborator' | 'no_github_linked' | 'no_repo_linked' | 'error';

export function MemberGitHubStatus({ projectId, userId, currentUserId }: MemberGitHubStatusProps) {
    const [status, setStatus] = useState<statusTypes | null>(null);
    const [isInviting, setIsInviting] = useState(false);

    // We need to know if the CURRENT caller is a lead/manager to show the "Invite to Repo" button
    const { canManageMembers } = useUserRole(projectId, currentUserId);

    useEffect(() => {
        async function checkStatus() {
            try {
                const res = await fetch(`/api/github/check-collaborator?projectId=${projectId}&userId=${userId}`);
                const data = await res.json();
                if (data.status) {
                    setStatus(data.status);
                } else {
                    setStatus('error');
                }
            } catch {
                setStatus('error');
            }
        }
        checkStatus();
    }, [projectId, userId]);

    const handleInvite = async () => {
        try {
            setIsInviting(true);
            const res = await fetch('/api/github/invite-collaborator', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ projectId, userId }),
            });
            const data = await res.json();
            if (data.status === 'invited' || data.status === 'already_collaborator') {
                setStatus('collaborator');
            }
        } catch (e) {
            console.error(e);
        } finally {
            setIsInviting(false);
        }
    };

    if (!status) {
        return <FaSpinner className="animate-spin text-gray-400" />;
    }

    if (status === 'no_repo_linked') return null;

    if (status === 'no_github_linked') {
        return <span className="text-sm text-gray-400">No GitHub linked</span>;
    }

    if (status === 'collaborator') {
        return (
            <div className="flex items-center gap-1.5 text-green-600 text-sm font-medium">
                <FaCheckCircle className="w-4 h-4" />
                <span>Collaborator</span>
            </div>
        );
    }

    if (status === 'not_collaborator') {
        if (canManageMembers) {
            return (
                <button
                    onClick={handleInvite}
                    disabled={isInviting}
                    className="px-3 py-1 text-xs font-medium rounded-md bg-black text-white hover:bg-gray-800 disabled:opacity-50 transition-colors"
                >
                    {isInviting ? 'Inviting...' : 'Invite to Repo'}
                </button>
            );
        } else {
            return <span className="text-sm text-gray-500">Not in repo</span>;
        }
    }

    return <span className="text-sm text-red-400">Error fetching status</span>;
}
