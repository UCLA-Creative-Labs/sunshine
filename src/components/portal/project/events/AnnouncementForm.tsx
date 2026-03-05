"use client";

import React, { useState } from 'react';
import { CreateAnnouncementInput, AnnouncementVisibility, BoardTeam } from '@/types/events';

interface AnnouncementFormProps {
  projectId: string;
  onSubmit: (input: CreateAnnouncementInput) => Promise<void>;
  onCancel: () => void;
  isSubmitting: boolean;
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

const VISIBILITY_OPTIONS = [
  { value: 'project', label: 'Project Only' },
  { value: 'team', label: 'Specific Team' },
  { value: 'board', label: 'Board Members' },
  { value: 'club_wide', label: 'Entire Club' },
];

const TEAM_OPTIONS = [
  { value: 'tech', label: 'Tech' },
  { value: 'finance', label: 'Finance' },
  { value: 'marketing', label: 'Marketing' },
  { value: 'design', label: 'Design' },
  { value: 'project_managers', label: 'Project Managers' },
];

export function AnnouncementForm({
  projectId,
  onSubmit,
  onCancel,
  isSubmitting,
}: AnnouncementFormProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [announcementType, setAnnouncementType] = useState('general');
  const [priority, setPriority] = useState('normal');
  const [isPinned, setIsPinned] = useState(false);
  const [showOnCard, setShowOnCard] = useState(true);
  const [linkUrl, setLinkUrl] = useState('');
  const [linkText, setLinkText] = useState('');
  const [expireDate, setExpireDate] = useState('');
  const [visibility, setVisibility] = useState<AnnouncementVisibility>('project');
  const [targetTeam, setTargetTeam] = useState<BoardTeam | ''>('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};
    if (!title.trim()) newErrors.title = 'Title is required';
    if (!description.trim()) newErrors.description = 'Description is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    const input: CreateAnnouncementInput = {
      project_id: projectId,
      title: title.trim(),
      description: description.trim(),
      announcement_type: announcementType,
      priority,
      is_pinned: isPinned,
      show_on_card: showOnCard,
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

  const inputClass = "w-full rounded-lg border border-[#D4D7E5] px-4 py-2 text-sm focus:border-[#3F86FF] focus:outline-none";
  const labelClass = "mb-1 block text-sm font-medium text-black/70";
  const errorClass = "mt-1 text-xs text-red-500";

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
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

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className={labelClass}>Visibility</label>
          <select
            value={visibility}
            onChange={(e) => setVisibility(e.target.value as AnnouncementVisibility)}
            className={inputClass}
          >
            {VISIBILITY_OPTIONS.map(opt => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        </div>
        {visibility === 'team' && (
          <div>
            <label className={labelClass}>Target Team</label>
            <select
              value={targetTeam}
              onChange={(e) => setTargetTeam(e.target.value as BoardTeam)}
              className={inputClass}
              required
            >
              <option value="">Select a team</option>
              {TEAM_OPTIONS.map(opt => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </div>
        )}
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

      <div className="flex gap-6">
        <label className="flex items-center gap-2 text-sm text-black/70">
          <input
            type="checkbox"
            checked={isPinned}
            onChange={(e) => setIsPinned(e.target.checked)}
            className="rounded border-[#D4D7E5]"
          />
          Pin Announcement
        </label>
        <label className="flex items-center gap-2 text-sm text-black/70">
          <input
            type="checkbox"
            checked={showOnCard}
            onChange={(e) => setShowOnCard(e.target.checked)}
            className="rounded border-[#D4D7E5]"
          />
          Show on Card
        </label>
      </div>

      <div className="flex justify-end gap-3 pt-4">
        <button
          type="button"
          onClick={onCancel}
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
  );
}
