"use client";

import React, { useState, useEffect } from 'react';
import { profileService } from '@/lib/supabase/profileService';
import { ProjectEvent } from '@/types/events';

interface Project {
  id: string;
  projectName: string;
}

interface EventFormProps {
  userId: string;
  onSubmit: (eventData: Omit<ProjectEvent, 'id' | 'created_at' | 'updated_at'>) => Promise<void>;
  onCancel: () => void;
  isSubmitting: boolean;
}

/**
 * Event creation form
 */
export function EventForm({
  userId,
  onSubmit,
  onCancel,
  isSubmitting,
}: EventFormProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [projectId, setProjectId] = useState('');
  const [eventDate, setEventDate] = useState('');
  const [eventTimeDisplay, setEventTimeDisplay] = useState('');
  const [endDate, setEndDate] = useState('');
  const [location, setLocation] = useState('');
  const [locationType, setLocationType] = useState('');
  const [virtualLink, setVirtualLink] = useState('');
  const [rsvpLink, setRsvpLink] = useState('');
  const [rsvpRequired, setRsvpRequired] = useState(false);
  const [maxAttendees, setMaxAttendees] = useState('');
  const [eventType, setEventType] = useState('');
  const [projects, setProjects] = useState<Project[]>([]);
  const [loadingProjects, setLoadingProjects] = useState(true);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    async function fetchProjects() {
      try {
        setLoadingProjects(true);
        const userProjects = await profileService.getUserProjects(userId);
        const formattedProjects = userProjects.map((p: any) => ({
          id: p.projects.id,
          projectName: p.projects.projectName,
        }));
        setProjects(formattedProjects);
        if (formattedProjects.length > 0) {
          setProjectId(formattedProjects[0].id);
        }
      } catch (error) {
        console.error('Error fetching projects:', error);
      } finally {
        setLoadingProjects(false);
      }
    }

    if (userId) {
      fetchProjects();
    }
  }, [userId]);

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!title.trim()) newErrors.title = 'Event title is required';
    if (!projectId) newErrors.projectId = 'Project is required';
    if (!eventDate) {
      newErrors.eventDate = 'Event date is required';
    } else {
      const selectedDate = new Date(eventDate);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      if (selectedDate < today) {
        newErrors.eventDate = 'Event date must be in the future';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) return;

    const eventData: Omit<ProjectEvent, 'id' | 'created_at' | 'updated_at'> = {
      project_id: projectId,
      title: title.trim(),
      description: description.trim() || null,
      event_type: eventType.trim() || null,
      event_date: new Date(eventDate + 'T00:00:00').toISOString(),
      event_time_display: eventTimeDisplay.trim() || null,
      end_date: endDate ? new Date(endDate + 'T00:00:00').toISOString() : null,
      location: location.trim() || null,
      location_type: locationType.trim() || null,
      virtual_link: virtualLink.trim() || null,
      rsvp_link: rsvpLink.trim() || null,
      rsvp_required: rsvpRequired,
      max_attendees: maxAttendees ? parseInt(maxAttendees, 10) : null,
      image_url: null,
      status: 'upcoming',
      is_public: true,
      visibility: 'project',
      target_team: null,
    };

    await onSubmit(eventData);
  };

  const inputClass = "w-full rounded-lg border border-[#D4D7E5] px-4 py-2 text-sm focus:border-[#3F86FF] focus:outline-none";
  const labelClass = "mb-1 block text-sm font-medium text-black/70";
  const errorClass = "mt-1 text-xs text-red-500";

  if (loadingProjects) {
    return (
      <div className="text-center py-8">
        <p className="text-sm text-black/60">Loading projects...</p>
      </div>
    );
  }

  if (projects.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-sm text-black/60 mb-4">You need to be part of a project to create events.</p>
        <button
          type="button"
          onClick={onCancel}
          className="rounded-lg border border-[#D4D7E5] px-4 py-2 text-sm font-medium text-black/70 hover:bg-gray-50"
        >
          Close
        </button>
      </div>
    );
  }

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
        <label className={labelClass}>Project *</label>
        <select
          value={projectId}
          onChange={(e) => setProjectId(e.target.value)}
          className={inputClass}
        >
          {projects.map((project) => (
            <option key={project.id} value={project.id}>
              {project.projectName}
            </option>
          ))}
        </select>
        {errors.projectId && <p className={errorClass}>{errors.projectId}</p>}
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
            placeholder="e.g., 2:00 PM - 4:00 PM"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className={labelClass}>End Date</label>
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className={inputClass}
          />
        </div>
        <div>
          <label className={labelClass}>Event Type</label>
          <input
            type="text"
            value={eventType}
            onChange={(e) => setEventType(e.target.value)}
            className={inputClass}
            placeholder="e.g., Meeting, Workshop, Social"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className={labelClass}>Location</label>
          <input
            type="text"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className={inputClass}
            placeholder="Enter location"
          />
        </div>
        <div>
          <label className={labelClass}>Location Type</label>
          <select
            value={locationType}
            onChange={(e) => setLocationType(e.target.value)}
            className={inputClass}
          >
            <option value="">Select type</option>
            <option value="in_person">In Person</option>
            <option value="virtual">Virtual</option>
            <option value="hybrid">Hybrid</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className={labelClass}>Virtual Link</label>
          <input
            type="url"
            value={virtualLink}
            onChange={(e) => setVirtualLink(e.target.value)}
            className={inputClass}
            placeholder="https://..."
          />
        </div>
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
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className={labelClass}>Max Attendees</label>
          <input
            type="number"
            value={maxAttendees}
            onChange={(e) => setMaxAttendees(e.target.value)}
            className={inputClass}
            placeholder="Optional"
            min="1"
          />
        </div>
        <div className="flex items-end">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={rsvpRequired}
              onChange={(e) => setRsvpRequired(e.target.checked)}
              className="w-4 h-4 rounded border-gray-300 text-[#3F86FF] focus:ring-[#3F86FF]"
            />
            <span className={labelClass}>RSVP Required</span>
          </label>
        </div>
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
