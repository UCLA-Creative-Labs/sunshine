"use client";

import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { CreateAnnouncementInput, AnnouncementVisibility, BoardTeam } from '@/types/events';

interface DashboardAnnouncementModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (input: CreateAnnouncementInput) => Promise<void>;
  userProjects: { id: string; projectName: string; isLead: boolean }[];
  isDirectorOrPresident: boolean;
  isSubmitting?: boolean;
}

const ANNOUNCEMENT_TYPES = [
  { value: 'general', label: 'General' },
  { value: 'update', label: 'Update' },
  { value: 'milestone', label: 'Milestone' },
  { value: 'recruitment', label: 'Recruitment' },
  { value: 'launch', label: 'Launch' },
];

const PRIORITY_OPTIONS = [
  { value: 'low', label: 'Low' },
  { value: 'normal', label: 'Normal' },
  { value: 'high', label: 'High' },
  { value: 'urgent', label: 'Urgent' },
];

const BOARD_TEAMS: { value: BoardTeam; label: string }[] = [
  { value: 'tech', label: 'Tech' },
  { value: 'finance', label: 'Finance' },
  { value: 'marketing', label: 'Marketing' },
  { value: 'design', label: 'Design' },
];

export function DashboardAnnouncementModal({
  isOpen,
  onClose,
  onSubmit,
  userProjects,
  isDirectorOrPresident,
  isSubmitting = false,
}: DashboardAnnouncementModalProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [announcementType, setAnnouncementType] = useState('general');
  const [priority, setPriority] = useState('normal');
  const [visibility, setVisibility] = useState<AnnouncementVisibility>('project');
  const [targetTeam, setTargetTeam] = useState<BoardTeam | ''>('');
  const [selectedProjectId, setSelectedProjectId] = useState(userProjects[0]?.id || '');
  const [isPinned, setIsPinned] = useState(false);
  const [linkUrl, setLinkUrl] = useState('');
  const [linkText, setLinkText] = useState('');
  const [expireDate, setExpireDate] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  if (!isOpen) return null;

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};
    if (!title.trim()) newErrors.title = 'Title is required';
    if (!description.trim()) newErrors.description = 'Description is required';
    if (visibility === 'project' && !selectedProjectId) newErrors.project = 'Select a project';
    if (visibility === 'team' && !targetTeam) newErrors.team = 'Select a team';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    const input: CreateAnnouncementInput = {
      project_id: visibility === 'project' ? selectedProjectId : null,
      title: title.trim(),
      description: description.trim(),
      announcement_type: announcementType,
      priority,
      is_pinned: isPinned,
      show_on_card: true,
      image_url: null,
      link_url: linkUrl.trim() || null,
      link_text: linkText.trim() || null,
      publish_date: new Date().toISOString(),
      expire_date: expireDate ? new Date(expireDate).toISOString() : null,
      is_active: true,
      visibility,
      target_team: visibility === 'team' ? (targetTeam as BoardTeam) : null,
    };

    await onSubmit(input);
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) onClose();
  };

  const inputClass = "w-full rounded-lg border border-[#D4D7E5] px-4 py-2 text-sm text-black bg-white focus:border-[#3F86FF] focus:outline-none";
  const labelClass = "mb-1 block text-sm font-medium text-black/70";
  const errorClass = "mt-1 text-xs text-red-500";

  return createPortal(
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 p-4"
      onClick={handleBackdropClick}
    >
      <div
        className="w-full max-w-lg rounded-2xl bg-white shadow-xl flex flex-col"
        style={{ maxHeight: 'calc(100vh - 4rem)' }}
      >
        <div className="flex items-center justify-between p-6 pb-4 shrink-0">
          <h2 className="text-xl font-semibold">New Announcement</h2>
          <button
            onClick={onClose}
            className="text-black/50 hover:text-black"
            aria-label="Close modal"
          >
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 overflow-y-auto px-6 pb-6">
          {/* Visibility selector - only show Board Team / Club-Wide for directors/presidents */}
          {isDirectorOrPresident && (
            <div>
              <label className={labelClass}>Who should see this? *</label>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setVisibility('project')}
                  className={`rounded-full px-3 py-1.5 text-xs font-medium transition-colors ${
                    visibility === 'project'
                      ? 'bg-[#3F86FF] text-white'
                      : 'bg-[#E5E7EB] text-black/70 hover:bg-[#D4D7E5]'
                  }`}
                >
                  My Project
                </button>
                <button
                  type="button"
                  onClick={() => setVisibility('team')}
                  className={`rounded-full px-3 py-1.5 text-xs font-medium transition-colors ${
                    visibility === 'team'
                      ? 'bg-[#3F86FF] text-white'
                      : 'bg-[#E5E7EB] text-black/70 hover:bg-[#D4D7E5]'
                  }`}
                >
                  Board Team
                </button>
                <button
                  type="button"
                  onClick={() => setVisibility('club_wide')}
                  className={`rounded-full px-3 py-1.5 text-xs font-medium transition-colors ${
                    visibility === 'club_wide'
                      ? 'bg-[#3F86FF] text-white'
                      : 'bg-[#E5E7EB] text-black/70 hover:bg-[#D4D7E5]'
                  }`}
                >
                  Club-Wide
                </button>
              </div>
            </div>
          )}

          {/* Project selector (for project-scoped) */}
          {visibility === 'project' && (
            <div>
              <label className={labelClass}>Project *</label>
              <select
                value={selectedProjectId}
                onChange={(e) => setSelectedProjectId(e.target.value)}
                className={inputClass}
              >
                <option value="">Select a project</option>
                {userProjects.map((p) => (
                  <option key={p.id} value={p.id}>{p.projectName}</option>
                ))}
              </select>
              {errors.project && <p className={errorClass}>{errors.project}</p>}
            </div>
          )}

          {/* Team selector (for team-scoped) */}
          {visibility === 'team' && (
            <div>
              <label className={labelClass}>Board Team *</label>
              <select
                value={targetTeam}
                onChange={(e) => setTargetTeam(e.target.value as BoardTeam)}
                className={inputClass}
              >
                <option value="">Select a team</option>
                {BOARD_TEAMS.map((t) => (
                  <option key={t.value} value={t.value}>{t.label}</option>
                ))}
              </select>
              {errors.team && <p className={errorClass}>{errors.team}</p>}
            </div>
          )}

          <div>
            <label className={labelClass}>Title *</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className={inputClass}
              placeholder="Announcement title"
            />
            {errors.title && <p className={errorClass}>{errors.title}</p>}
          </div>

          <div>
            <label className={labelClass}>Description *</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className={`${inputClass} min-h-[80px] resize-none`}
              placeholder="What do you want to announce?"
            />
            {errors.description && <p className={errorClass}>{errors.description}</p>}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Type</label>
              <select
                value={announcementType}
                onChange={(e) => setAnnouncementType(e.target.value)}
                className={inputClass}
              >
                {ANNOUNCEMENT_TYPES.map(opt => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            </div>
            <div>
              <label className={labelClass}>Priority</label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
                className={inputClass}
              >
                {PRIORITY_OPTIONS.map(opt => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className={labelClass}>Expiration Date</label>
            <input
              type="date"
              value={expireDate}
              onChange={(e) => setExpireDate(e.target.value)}
              className={inputClass}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Link URL</label>
              <input
                type="url"
                value={linkUrl}
                onChange={(e) => setLinkUrl(e.target.value)}
                className={inputClass}
                placeholder="https://..."
              />
            </div>
            <div>
              <label className={labelClass}>Link Text</label>
              <input
                type="text"
                value={linkText}
                onChange={(e) => setLinkText(e.target.value)}
                className={inputClass}
                placeholder="e.g. Learn more"
              />
            </div>
          </div>

          <label className="flex items-center gap-2 text-sm text-black/70">
            <input
              type="checkbox"
              checked={isPinned}
              onChange={(e) => setIsPinned(e.target.checked)}
              className="rounded border-[#D4D7E5]"
            />
            Pin Announcement
          </label>

          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border border-[#D4D7E5] px-4 py-2 text-sm font-medium text-black/70 hover:bg-gray-50"
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="rounded-lg bg-[#3F86FF] px-4 py-2 text-sm font-medium text-white hover:bg-[#346edd] disabled:opacity-50"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Posting...' : 'Post Announcement'}
            </button>
          </div>
        </form>
      </div>
    </div>,
    document.body
  );
}
