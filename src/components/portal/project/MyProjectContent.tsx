"use client";

import React, { useEffect, useState, useCallback } from "react";
import Image from "next/image";
import { FaGithub, FaPencil, FaChevronLeft, FaChevronRight } from "react-icons/fa6";
import { SiFigma, SiNotion } from "react-icons/si";
import { getProjectById, updateProject } from "@/lib/supabase/projectService";
import { getProjectEvents, getProjectAnnouncements, createEvent, createAnnouncement } from '@/lib/supabase/eventsService';
import { Project } from "@/types/project";
import { ProjectEvent, ProjectAnnouncement, CreateEventInput, CreateAnnouncementInput } from '@/types/events';
import { AddEventModal } from './events/AddEventModal';
import { AddAnnouncementModal } from './events/AddAnnouncementModal';
import ProjectEventCard from '@/components/portal/ProjectEventCard';
import { useUserRole } from '@/lib/hooks/useUserRole';

const CARD_STYLES = {
  base: "rounded-2xl border border-[#D4D7E5] bg-white p-6 md:p-8 shadow-lg transform transition-all duration-300 ease-out hover:-translate-y-1 hover:shadow-xl",
  titleDefault: "mb-3 text-2xl font-semibold tracking-tight text-black",
} as const;

const AVATAR_STYLES = {
  large: "flex h-14 w-14 items-center justify-center overflow-hidden rounded-full bg-[#E5E7EB]",
  medium: "h-10 w-10 flex-shrink-0 overflow-hidden rounded-full bg-[#E5E7EB]",
  small: "inline-flex h-8 w-8 items-center justify-center overflow-hidden rounded-full bg-[#E5E7EB]",
} as const;

function useMountAnimation(delay: number) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const timeout = setTimeout(() => setMounted(true), delay);
    return () => clearTimeout(timeout);
  }, [delay]);

  return mounted;
}

interface SectionProps {
  title: string;
  children: React.ReactNode;
  className?: string;
  titleClassName?: string;
  delay?: number;
}

function Section({ title, children, className = "", titleClassName, delay = 0 }: SectionProps) {
  const mounted = useMountAnimation(delay);
  const enterClasses = mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-3";

  return (
    <section
      className={`${className} transform transition-all duration-300 ease-out ${enterClasses}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      <h2 className={titleClassName ?? CARD_STYLES.titleDefault}>
        {title}
      </h2>
      <div className={CARD_STYLES.base}>
        {children}
      </div>
    </section>
  );
}

function TaskLink({ children }: { children: React.ReactNode }) {
  return <span className="font-semibold text-[#3F86FF]">{children}</span>;
}

interface ActivityItemProps {
  name: string;
  time: string;
  action: React.ReactNode;
  comment?: string;
}

function ActivityItem({ name, time, action, comment }: ActivityItemProps) {
  return (
    <div className="flex gap-3">
      <div className={AVATAR_STYLES.medium}>
        <Image
          src="/images/default-avatar.svg"
          alt={`${name} avatar`}
          width={40}
          height={40}
          className="h-full w-full object-cover"
        />
      </div>
      <div className="flex-1">
        <div className="mb-1 flex items-center justify-between">
          <p className="font-semibold">{name}</p>
          <p className="text-[10px] md:text-[11px] text-black/50">{time}</p>
        </div>
        <p>{action}</p>
        {comment && (
          <div className="mt-2 inline-block rounded-2xl bg-[#EAF4FF] px-4 py-3 text-[11px] md:text-xs text-black/80">
            {comment}
          </div>
        )}
      </div>
    </div>
  );
}

interface MyProjectContentProps {
  projectId: string;
  currentUserId: string;
}

// TODO: Fetch project data from database (description, leads, tasks, activity)
export default function MyProjectContent({ projectId, currentUserId }: MyProjectContentProps) {
  const { canPostEvents } = useUserRole(projectId, currentUserId);
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Edit mode state
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState<Partial<Project>>({});
  const [isSaving, setIsSaving] = useState(false);

  // Events and announcements state
  const [events, setEvents] = useState<ProjectEvent[]>([]);
  const [announcements, setAnnouncements] = useState<ProjectAnnouncement[]>([]);
  const [showEventModal, setShowEventModal] = useState(false);
  const [showAnnouncementModal, setShowAnnouncementModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    async function fetchProject() {
      try {
        setLoading(true);
        const data = await getProjectById(projectId);
        setProject(data);
      } catch (err) {
        setError("Failed to load project data");
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchProject();
  }, [projectId]);

  const fetchEvents = useCallback(async () => {
    const data = await getProjectEvents(projectId, { includeCompleted: false });
    setEvents(data);
  }, [projectId]);

  const fetchAnnouncements = useCallback(async () => {
    const data = await getProjectAnnouncements(projectId);
    setAnnouncements(data);
  }, [projectId]);

  useEffect(() => {
    fetchEvents();
    fetchAnnouncements();
  }, [fetchEvents, fetchAnnouncements]);

  const handleCreateEvent = async (input: CreateEventInput) => {
    setIsSubmitting(true);
    try {
      await createEvent(input);
      await fetchEvents();
      setShowEventModal(false);
    } catch (err) {
      console.error('Failed to create event:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCreateAnnouncement = async (input: CreateAnnouncementInput) => {
    setIsSubmitting(true);
    try {
      await createAnnouncement(input);
      await fetchAnnouncements();
      setShowAnnouncementModal(false);
    } catch (err) {
      console.error('Failed to create announcement:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <p className="text-black/60">Loading project...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center py-20">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="flex items-center justify-center py-20">
        <p className="text-black/60">No project found for this user.</p>
      </div>
    );
  }

  const handleEditClick = () => {
    if (project) {
      setEditForm({
        projectName: project.projectName,
        projectDescription: project.projectDescription,
        year: project.year,
        quarter: project.quarter,
      });
      setIsEditing(true);
    }
  };

  const handleCancelClick = () => {
    setIsEditing(false);
    setEditForm({});
  };

  const handleSaveClick = async () => {
    if (!project) return;

    try {
      setIsSaving(true);
      const updatedProject = await updateProject(project.id, editForm);
      if (updatedProject) {
        setProject(updatedProject);
        setIsEditing(false);
      }
    } catch (err) {
      console.error("Failed to save project:", err);
      setError("Failed to save changes");
    } finally {
      setIsSaving(false);
    }
  };

  const handleInputChange = (field: keyof Project, value: string) => {
    setEditForm(prev => ({ ...prev, [field]: value }));
  };

  const handleYearStep = (direction: 'next' | 'prev') => {
    const currentYearStr = editForm.year || "23-24";
    // Parse start year from "YY-YY" format
    let startYear = parseInt("20" + currentYearStr.split("-")[0]);

    if (isNaN(startYear)) startYear = 2023; // Default fallback

    const newStartYear = direction === 'next' ? startYear + 1 : startYear - 1;

    // Format back to "YY-YY"
    const startStr = newStartYear.toString().slice(-2);
    const endStr = (newStartYear + 1).toString().slice(-2);
    const newYearStr = `${startStr}-${endStr}`;

    handleInputChange("year", newYearStr);
  };

  return (
    <>

      {/* Project Name from database */}
      <section className="space-y-4 mb-10">
        <div className="flex items-start justify-between gap-4">
          {isEditing ? (
            <div className="flex-1 space-y-4">
              <input
                type="text"
                value={editForm.projectName || ""}
                onChange={(e) => handleInputChange("projectName", e.target.value)}
                className="w-full rounded-xl border border-gray-200 px-4 py-2 text-3xl md:text-4xl font-semibold tracking-tight focus:border-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-500/10 placeholder:text-gray-300 transition-all"
                placeholder="Project Name"
                aria-label="Project Name"
              />
              <div className="flex flex-col sm:flex-row gap-4">
                {/* Quarter Segmented Control */}
                <div className="flex rounded-xl bg-gray-100 p-1 border border-gray-200">
                  {["Fall", "Winter", "Spring"].map((q) => (
                    <button
                      key={q}
                      onClick={() => handleInputChange("quarter", q)}
                      className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all ${editForm.quarter === q
                        ? "bg-white text-black shadow-sm"
                        : "text-gray-500 hover:text-black"
                        }`}
                    >
                      {q}
                    </button>
                  ))}
                </div>

                {/* Year Stepper */}
                <div className="flex items-center rounded-xl border border-gray-200 bg-white px-2 py-1">
                  <button
                    onClick={() => handleYearStep('prev')}
                    className="p-2 text-gray-500 hover:text-black hover:bg-gray-50 rounded-lg transition-colors"
                  >
                    <FaChevronLeft className="w-3 h-3" />
                  </button>
                  <span className="w-20 text-center font-medium text-sm">
                    {editForm.year || "23-24"}
                  </span>
                  <button
                    onClick={() => handleYearStep('next')}
                    className="p-2 text-gray-500 hover:text-black hover:bg-gray-50 rounded-lg transition-colors"
                  >
                    <FaChevronRight className="w-3 h-3" />
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-1">
              <h1 className="text-3xl md:text-4xl font-semibold tracking-tight">
                {project.projectName || "My Project"}
              </h1>
              <p className="text-black/60">
                {project.quarter} {project.year}
              </p>
            </div>
          )}

          {/* Edit Actions */}
          <div className="flex-shrink-0">
            {isEditing ? (
              <div className="flex gap-2">
                <button
                  onClick={handleCancelClick}
                  disabled={isSaving}
                  className="rounded-lg px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveClick}
                  disabled={isSaving}
                  className="rounded-lg bg-black px-4 py-2 text-sm font-medium text-white hover:bg-gray-800 disabled:opacity-50"
                >
                  {isSaving ? "Saving..." : "Save"}
                </button>
              </div>
            ) : (
              <button
                onClick={handleEditClick}
                className="flex items-center gap-2 rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                <FaPencil className="h-3 w-3" />
                Edit
              </button>
            )}
          </div>
        </div>
      </section>

      <div className="grid gap-10 lg:gap-14 lg:grid-cols-[minmax(0,2fr)_minmax(260px,1fr)]">
        {/* Left column */}
        <div className="space-y-14">
          {/* Project Description from database */}
          <Section title="Project Description" delay={0}>
            {isEditing ? (
              <textarea
                value={editForm.projectDescription || ""}
                onChange={(e) => handleInputChange("projectDescription", e.target.value)}
                className="w-full min-h-[150px] rounded-xl border border-gray-200 px-4 py-3 text-sm md:text-base focus:border-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-500/10 placeholder:text-gray-300 transition-all resize-y"
                placeholder="Project Description"
                aria-label="Project Description"
              />
            ) : (
              <p className="text-sm md:text-base text-black/80 whitespace-pre-wrap">
                {project.projectDescription || "No description available."}
              </p>
            )}
          </Section>

          {/* Project Leads from database */}
          <Section title="Project Leads" delay={80}>
            <div className="flex flex-wrap gap-4">
              {project.projectLeads && project.projectLeads.length > 0 ? (
                project.projectLeads.map((lead, index) => (
                  <div key={index} className="flex items-center gap-4">
                    <div className={AVATAR_STYLES.large}>
                      <Image
                        src="/images/default-avatar.svg"
                        alt={`${lead} avatar`}
                        width={56}
                        height={56}
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm font-semibold text-[#E1225C]">
                        {lead}
                      </p>
                      <p className="text-xs text-black/70">Project Lead</p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-sm text-black/60">No project leads assigned.</p>
              )}
            </div>
          </Section>

          {/* TODO: Replace with user's assigned tasks from database */}
          <Section title="My Tasks" delay={160}>
            <div className="overflow-x-auto">
              <table className="min-w-full text-left text-xs md:text-sm text-black/80">
                <thead>
                  <tr className="border-b border-[#E2E4F0]">
                    <th className="pb-3 pr-6 font-semibold">Name</th>
                    <th className="pb-3 pr-6 font-semibold">Priority</th>
                    <th className="pb-3 pr-6 font-semibold">Topic</th>
                    <th className="pb-3 pr-6 font-semibold">Status</th>
                    <th className="pb-3 font-semibold">Assignee</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="py-4 pr-6 align-middle">
                      <span className="text-black/60 mr-1">#67</span>
                      Follow CL on IG!
                    </td>
                    <td className="py-4 pr-6 align-middle">
                      <span className="rounded-full bg-[#FFE3E3] px-3 py-1 text-xs font-medium text-[#E1225C]">
                        High
                      </span>
                    </td>
                    <td className="py-4 pr-6 align-middle">
                      <span className="rounded-full bg-[#FFE6D5] px-3 py-1 text-xs font-medium text-[#D26A00]">
                        Bug
                      </span>
                    </td>
<td className="py-4 pr-6 align-middle">
                      <span className="rounded-full bg-[#E2F7E6] px-3 py-1 text-xs font-medium text-[#1F7A3D]">
                        In-Progress
                      </span>
                    </td>
                    <td className="py-4 align-middle">
                      <span className={AVATAR_STYLES.small}>
                        <Image
                          src="/images/default-avatar.svg"
                          alt="Task assignee avatar"
                          width={32}
                          height={32}
                          className="h-full w-full object-cover"
                        />
                      </span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </Section>

          {/* Upcoming Events */}
          <section className="space-y-4 transform transition-all duration-300 ease-out">
            <div className="flex items-center justify-between">
              <h2 className={CARD_STYLES.titleDefault}>Upcoming Events</h2>
              {canPostEvents && (
                <button
                  onClick={() => setShowEventModal(true)}
                  className="flex items-center gap-1.5 rounded-lg bg-[#3F86FF] px-3 py-1.5 text-xs font-medium text-white hover:bg-[#346edd] transition-colors"
                >
                  <span className="text-base leading-none">+</span>
                  <span>Add Event</span>
                </button>
              )}
            </div>
            <div className={CARD_STYLES.base}>
              {events.length === 0 ? (
                <p className="text-sm text-black/50">No upcoming events</p>
              ) : (
                <div className="space-y-4">
                  {events.map(event => (
                    <ProjectEventCard key={event.id} event={event} compact />
                  ))}
                </div>
              )}
            </div>
          </section>

          {/* Announcements */}
          <section className="space-y-4 transform transition-all duration-300 ease-out">
            <div className="flex items-center justify-between">
              <h2 className={CARD_STYLES.titleDefault}>Announcements</h2>
              {canPostEvents && (
                <button
                  onClick={() => setShowAnnouncementModal(true)}
                  className="flex items-center gap-1.5 rounded-lg bg-[#3F86FF] px-3 py-1.5 text-xs font-medium text-white hover:bg-[#346edd] transition-colors"
                >
                  <span className="text-base leading-none">+</span>
                  <span>Add Announcement</span>
                </button>
              )}
            </div>
            <div className={CARD_STYLES.base}>
              {announcements.length === 0 ? (
                <p className="text-sm text-black/50">No announcements</p>
              ) : (
                <div className="space-y-4">
                  {announcements.map(announcement => (
                    <div key={announcement.id} className="border-l-4 border-[#3F86FF] bg-blue-50 p-3 rounded-lg">
                      <h4 className="font-bold text-sm text-gray-900">{announcement.title}</h4>
                      {announcement.description && (
                        <p className="text-xs text-gray-600 mt-1">{announcement.description}</p>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </section>
        </div>

        {/* Right column */}
        <div className="space-y-14">
          {/* TODO: Replace with project.recentActivity from database */}
          <Section title="Recent Activity" delay={240}>
            <div className="space-y-7 text-xs md:text-sm text-black/80">
              <ActivityItem
                name="Sunny Vinay"
                time="9:05 AM"
                action={<>Created task <TaskLink>&quot;Design onboarding flow&quot;</TaskLink></>}
              />
              <ActivityItem
                name="Shawn Lin"
                time="9:42 AM"
                action="Commented on sprint planning"
                comment="Can we move this story to the next sprint?"
              />
              <ActivityItem
                name="Stephanie Pham"
                time="10:15 AM"
                action={<>Updated status of <TaskLink>&quot;Landing page redesign&quot;</TaskLink> to In Progress</>}
              />
              <ActivityItem
                name="Travis Nguyen"
                time="11:02 AM"
                action='Completed task "Hook up API to dashboard"'
              />
              <ActivityItem
                name="MJ Bagaoisan"
                time="11:45 AM"
                action="Reviewed pull request #42"
              />
              <ActivityItem
                name="LeBron James"
                time="12:10 PM"
                action="Assigned as project lead"
              />
            </div>
          </Section>

          <Section
            title="Quick Links"
            delay={320}
          >
            <div className="flex items-center justify-center gap-6 text-sm text-black/80">
              <a
                href="#"
                className="flex h-10 w-10 items-center justify-center rounded-full border border-black bg-white hover:bg-black hover:text-white transform transition-transform transition-colors duration-200 ease-out hover:-translate-y-0.5 hover:scale-105"
                aria-label="GitHub"
              >
                <FaGithub className="h-5 w-5" />
              </a>
              <a
                href="#"
                className="flex h-10 w-10 items-center justify-center rounded-full border border-black bg-white hover:bg-black hover:text-white transform transition-transform transition-colors duration-200 ease-out hover:-translate-y-0.5 hover:scale-105"
                aria-label="Figma"
              >
                <SiFigma className="h-5 w-5" />
              </a>
              <a
                href="#"
                className="flex h-10 w-10 items-center justify-center rounded-full border border-black bg-white hover:bg-black hover:text-white transform transition-transform transition-colors duration-200 ease-out hover:-translate-y-0.5 hover:scale-105"
                aria-label="Notion"
              >
                <SiNotion className="h-5 w-5" />
              </a>
            </div>
          </Section>
        </div>
      </div>

      <AddEventModal
        isOpen={showEventModal}
        onClose={() => setShowEventModal(false)}
        onSubmit={handleCreateEvent}
        projectId={projectId}
        isSubmitting={isSubmitting}
      />

      <AddAnnouncementModal
        isOpen={showAnnouncementModal}
        onClose={() => setShowAnnouncementModal(false)}
        onSubmit={handleCreateAnnouncement}
        projectId={projectId}
        isSubmitting={isSubmitting}
      />
    </>
  );
}
