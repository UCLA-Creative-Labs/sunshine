"use client";

import React, { useState } from 'react';
import { CreateEventInput } from '@/types/events';

interface EventFormProps {
  projectId: string;
  onSubmit: (input: CreateEventInput) => Promise<void>;
  onCancel: () => void;
  isSubmitting: boolean;
}

const LOCATION_TYPES = [
  { value: 'in_person', label: 'In Person' },
  { value: 'virtual', label: 'Virtual' },
  { value: 'hybrid', label: 'Hybrid' },
];

export function EventForm({
  projectId,
  onSubmit,
  onCancel,
  isSubmitting,
}: EventFormProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [eventDate, setEventDate] = useState('');
  const [eventTimeDisplay, setEventTimeDisplay] = useState('');
  const [location, setLocation] = useState('');
  const [locationType, setLocationType] = useState('in_person');
  const [virtualLink, setVirtualLink] = useState('');
  const [rsvpLink, setRsvpLink] = useState('');
  const [rsvpRequired, setRsvpRequired] = useState(false);
  const [isPublic, setIsPublic] = useState(true);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};
    if (!title.trim()) newErrors.title = 'Event title is required';
    if (!eventDate) newErrors.eventDate = 'Event date is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    const input: CreateEventInput = {
      project_id: projectId,
      title: title.trim(),
      description: description.trim() || null,
      event_type: null,
      event_date: new Date(eventDate).toISOString(),
      event_time_display: eventTimeDisplay || null,
      end_date: null,
      location: location.trim() || null,
      location_type: locationType,
      virtual_link: virtualLink.trim() || null,
      rsvp_link: rsvpLink.trim() || null,
      rsvp_required: rsvpRequired,
      max_attendees: null,
      image_url: null,
      status: 'upcoming',
      is_public: isPublic,
      visibility: 'project',
      target_team: null,
    };

    await onSubmit(input);
  };

  const inputClass = "w-full rounded-lg border border-[#D4D7E5] px-4 py-2 text-sm focus:border-[#3F86FF] focus:outline-none";
  const labelClass = "mb-1 block text-sm font-medium text-black/70";
  const errorClass = "mt-1 text-xs text-red-500";

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className={labelClass}>Event Title *</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className={inputClass}
          placeholder="Enter event title"
        />
        {errors.title && <p className={errorClass}>{errors.title}</p>}
      </div>

      <div>
        <label className={labelClass}>Description</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className={`${inputClass} min-h-[80px] resize-none`}
          placeholder="Describe the event"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className={labelClass}>Event Date *</label>
          <input
            type="date"
            value={eventDate}
            onChange={(e) => setEventDate(e.target.value)}
            className={inputClass}
          />
          {errors.eventDate && <p className={errorClass}>{errors.eventDate}</p>}
        </div>
        <div>
          <label className={labelClass}>Time Display</label>
          <input
            type="text"
            value={eventTimeDisplay}
            onChange={(e) => setEventTimeDisplay(e.target.value)}
            className={inputClass}
            placeholder="e.g. 2:00 PM - 4:00 PM"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className={labelClass}>Location Type</label>
          <select
            value={locationType}
            onChange={(e) => setLocationType(e.target.value)}
            className={inputClass}
          >
            {LOCATION_TYPES.map(opt => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        </div>
        <div>
          <label className={labelClass}>Location</label>
          <input
            type="text"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className={inputClass}
            placeholder="e.g. Boelter Hall 3400"
          />
        </div>
      </div>

      {(locationType === 'virtual' || locationType === 'hybrid') && (
        <div>
          <label className={labelClass}>Virtual Link</label>
          <input
            type="url"
            value={virtualLink}
            onChange={(e) => setVirtualLink(e.target.value)}
            className={inputClass}
            placeholder="https://zoom.us/..."
          />
        </div>
      )}

      <div>
        <label className={labelClass}>RSVP Link</label>
        <input
          type="url"
          value={rsvpLink}
          onChange={(e) => setRsvpLink(e.target.value)}
          className={inputClass}
          placeholder="https://..."
        />
      </div>

      <div className="flex gap-6">
        <label className="flex items-center gap-2 text-sm text-black/70">
          <input
            type="checkbox"
            checked={rsvpRequired}
            onChange={(e) => setRsvpRequired(e.target.checked)}
            className="rounded border-[#D4D7E5]"
          />
          RSVP Required
        </label>
        <label className="flex items-center gap-2 text-sm text-black/70">
          <input
            type="checkbox"
            checked={isPublic}
            onChange={(e) => setIsPublic(e.target.checked)}
            className="rounded border-[#D4D7E5]"
          />
          Public Event
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
          {isSubmitting ? 'Creating...' : 'Create Event'}
        </button>
      </div>
    </form>
  );
}
