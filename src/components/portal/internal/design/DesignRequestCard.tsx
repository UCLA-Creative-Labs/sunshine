'use client';

import { useState, useEffect } from 'react';
import { DesignRequest, DesignRequestStatus, COMMITTEE_COLORS, COMMITTEE_TEXT } from '@/types/designRequest';
import { updateDesignRequest } from '@/lib/supabase/designRequestService';
import { getProfileById } from '@/lib/supabase/profileService';
import { BsThreeDots } from 'react-icons/bs';


const STATUS_LABELS: Record<DesignRequestStatus, string> = {
  'Not started': 'Not Started',
  'In progress': 'In Progress',
  'Done': 'Done',
};

const STATUS_ACTIVE_CLASS: Record<DesignRequestStatus, string> = {
  'Not started': 'bg-white text-red-500 shadow-sm',
  'In progress': 'bg-white text-yellow-500 shadow-sm',
  'Done': 'bg-white text-green-500 shadow-sm',
};

// Simple background colors for avatars based on name hash
const AVATAR_COLORS = [
  'bg-pink-500',
  'bg-blue-500',
  'bg-green-500',
  'bg-purple-500',
  'bg-indigo-500',
  'bg-rose-500',
  'bg-amber-500',
];

function getAvatarColor(name: string) {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return AVATAR_COLORS[Math.abs(hash) % AVATAR_COLORS.length];
}

interface DesignRequestCardProps {
  request: DesignRequest;
  onEdit: () => void;
  onRefresh: () => void;
  isApprover: boolean;
}

export default function DesignRequestCard({ request, onEdit, onRefresh, isApprover }: DesignRequestCardProps) {
  const [isUpdating, setIsUpdating] = useState(false);
  const [creatorProfile, setCreatorProfile] = useState<{ name: string; id: string } | null>(null);

  useEffect(() => {
    if (!request.created_by) {
      setCreatorProfile({ name: 'Unknown', id: '' });
      return;
    }
    getProfileById(request.created_by).then((profile) => {
      if (profile) {
        setCreatorProfile({
          name: profile.display_name || [profile.first_name, profile.last_name].filter(Boolean).join(' ') || 'Unknown',
          id: profile.id
        });
      } else {
        setCreatorProfile({ name: 'Unknown', id: '' });
      }
    });
  }, [request.created_by]);

  const handleStatusChange = async (newStatus: DesignRequestStatus) => {
    if (newStatus === request.status) return;
    setIsUpdating(true);
    try {
      await updateDesignRequest(request.id, { status: newStatus });
      onRefresh();
    } catch (err) {
      console.error('Failed to update status:', err);
    } finally {
      setIsUpdating(false);
    }
  };

  const formattedDate = new Date(request.created_at).toLocaleString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });

  const creatorInitial = creatorProfile?.name.charAt(0).toUpperCase() || '?';
  const avatarBg = creatorProfile ? getAvatarColor(creatorProfile.name) : 'bg-gray-400';

  return (
    <div className="bg-white p-4 rounded-2xl shadow-sm border border-[#D4D7E5]/50 space-y-3 hover:shadow-md transition-shadow relative group">
      {/* Three-dot edit menu */}
      {isApprover && (
        <button
          onClick={onEdit}
          className="absolute top-3 right-3 p-1 rounded-lg hover:bg-gray-100 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity"
        >
          <BsThreeDots size={16} />
        </button>
      )}

      {/* Name / Title */}
      <div className="font-bold text-gray-800 leading-tight pr-6 text-[15px]">
        {request.name}
      </div>

      {/* Badges */}
      <div className="flex flex-col gap-1.5 pt-0.5">
        <div className="flex">
          <span
            className="text-[10px] font-bold px-2 py-0.5 rounded-md uppercase tracking-wide"
            style={{
              backgroundColor: COMMITTEE_COLORS[request.committee] || '#f3f4f6',
              color: COMMITTEE_TEXT[request.committee] || '#374151',
            }}
          >
            {request.committee}
          </span>
        </div>
        <div className="flex">
          <span className="text-[10px] font-bold bg-[#E5E7EB]/50 text-gray-600 px-2 py-0.5 rounded-md tracking-wide">
            {request.graphic_type}
          </span>
        </div>
      </div>

      {/* Creator row */}
      <div className="flex items-center gap-2 pt-1">
        <div className={`w-5 h-5 rounded-full ${avatarBg} flex items-center justify-center text-[10px] font-bold text-white shadow-sm`}>
          {creatorInitial}
        </div>
        <span className="text-[13px] text-gray-700 font-medium">{creatorProfile?.name}</span>
      </div>

      {/* Date */}
      <div className="text-[12px] text-gray-500 font-medium">
        {formattedDate}
      </div>

      {/* Status tabs */}
      {isApprover ? (
        <div className={`flex p-0.5 bg-gray-100/80 rounded-xl mt-2 ${isUpdating ? 'opacity-50 pointer-events-none' : ''}`}>
          {(Object.keys(STATUS_LABELS) as DesignRequestStatus[]).map((status) => (
            <button
              key={status}
              onClick={() => handleStatusChange(status)}
              className={`flex-1 text-[10px] font-bold py-1.5 px-1 rounded-lg transition-all ${
                request.status === status
                  ? STATUS_ACTIVE_CLASS[status]
                  : 'text-gray-400 hover:text-gray-500'
              }`}
            >
              {STATUS_LABELS[status]}
            </button>
          ))}
        </div>
      ) : (
        <div className="flex pt-1">
          <span className="text-[10px] font-bold bg-gray-100 text-gray-600 px-2 py-1 rounded-md">
            {STATUS_LABELS[request.status]}
          </span>
        </div>
      )}
    </div>
  );
}

