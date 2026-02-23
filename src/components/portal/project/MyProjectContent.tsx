"use client";

import React, { useEffect, useState, useMemo, useCallback } from "react";
import Image from "next/image";
import { FaGithub } from "react-icons/fa6";
import { SiFigma, SiNotion } from "react-icons/si";
import { useTasks } from '@/lib/hooks/useTasks';
import { useUserRole } from '@/lib/hooks/useUserRole';
import { getProjectById } from '@/lib/supabase/projectService';
import { getProjectEvents, getProjectAnnouncements, createEvent, createAnnouncement } from '@/lib/supabase/eventsService';
import { Project } from '@/lib/types/database';
import { ProjectEvent, ProjectAnnouncement, CreateEventInput, CreateAnnouncementInput } from '@/types/events';
import { AddEventModal } from './events/AddEventModal';
import { AddAnnouncementModal } from './events/AddAnnouncementModal';
import ProjectEventCard from '@/components/portal/ProjectEventCard';
import ProjectAnnouncementCard from '@/components/portal/ProjectAnnouncementCard';

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

export default function MyProjectContent({ projectId, currentUserId }: MyProjectContentProps) {
  const { tasks: allTasks, isLoading } = useTasks(projectId);
  const { canPostEvents } = useUserRole(projectId, currentUserId);
  const [project, setProject] = useState<Project | null>(null);
  const [projectLoading, setProjectLoading] = useState(true);
  const [events, setEvents] = useState<ProjectEvent[]>([]);
  const [announcements, setAnnouncements] = useState<ProjectAnnouncement[]>([]);
  const [showEventModal, setShowEventModal] = useState(false);
  const [showAnnouncementModal, setShowAnnouncementModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    async function fetchProject() {
      try {
        setProjectLoading(true);
        const data = await getProjectById(projectId);
        setProject(data);
      } catch (err) {
        console.error('Failed to load project data:', err);
      } finally {
        setProjectLoading(false);
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

  const myTasks = useMemo(() => {
    return allTasks.filter(task => 
      task.assignments.some(assignment => assignment.assignee.id === currentUserId)
    );
  }, [allTasks, currentUserId]);

  const getPriorityStyles = (priority: string) => {
    const styles = {
      low: { bg: '#E5F3FF', text: '#3F86FF' },
      medium: { bg: '#FFF3DC', text: '#FF9100' },
      high: { bg: '#FFE3E3', text: '#E1225C' },
      urgent: { bg: '#FFE3E3', text: '#E1225C' },
    };
    return styles[priority as keyof typeof styles] || styles.medium;
  };

  const getStatusStyles = (status: string) => {
    const styles = {
      todo: { bg: '#FFE7EA', text: '#E1225C', label: 'todo' },
      in_progress: { bg: '#E2F7E6', text: '#1F7A3D', label: 'in progress' },
      in_review: { bg: '#FFF3DC', text: '#FF9100', label: 'in review' },
      done: { bg: '#ECE3FF', text: '#6200EA', label: 'done' },
    };
    return styles[status as keyof typeof styles] || styles.todo;
  };

  return (
    <div className="grid gap-10 lg:gap-14 lg:grid-cols-[minmax(0,2fr)_minmax(260px,1fr)]">
      <div className="space-y-14">
        
        <Section title="Project Description" delay={80}>
          {projectLoading ? (
            <p className="text-sm text-black/50">Loading project details...</p>
          ) : (
            <p className="text-sm md:text-base text-black/80">
              {project?.projectDescription || "No description available."}
            </p>
          )}
        </Section>

        <Section title="Project Leads" delay={80}>
          {projectLoading ? (
            <p className="text-sm text-black/50">Loading leads...</p>
          ) : project?.projectLeads && project.projectLeads.length > 0 ? (
            <div className="flex flex-wrap gap-4">
              {project.projectLeads.map((lead, index) => (
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
              ))}
            </div>
          ) : (
            <p className="text-sm text-black/50">No project leads assigned.</p>
          )}
        </Section>

        <Section title="My Tasks" delay={160}>
          {isLoading ? (
            <p className="text-sm text-black/50">Loading tasks...</p>
          ) : myTasks.length === 0 ? (
            <p className="text-sm text-black/50">No tasks assigned to you yet</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full text-left text-xs md:text-sm text-black/80">
                <thead>
                  <tr className="border-b border-[#E2E4F0]">
                    <th className="pb-3 pr-6 font-semibold">Name</th>
                    <th className="pb-3 pr-6 font-semibold">Priority</th>
                    <th className="pb-3 pr-6 font-semibold">Label</th>
                    <th className="pb-3 pr-6 font-semibold">Status</th>
                    <th className="pb-3 font-semibold">Assignees</th>
                  </tr>
                </thead>
                <tbody>
                  {myTasks.map((task) => {
                    const priorityStyle = getPriorityStyles(task.priority);
                    const statusStyle = getStatusStyles(task.status);
                    return (
                      <tr key={task.id}>
                        <td className="py-4 pr-6 align-middle">
                          <span className="text-black/60 mr-1">#{task.id}</span>
                          {task.name}
                        </td>
                        <td className="py-4 pr-6 align-middle">
                          <span 
                            className="rounded-full px-3 py-1 text-xs font-medium"
                            style={{ backgroundColor: priorityStyle.bg, color: priorityStyle.text }}
                          >
                            {task.priority}
                          </span>
                        </td>
                        <td className="py-4 pr-6 align-middle">
                          <span 
                            className="rounded-full px-3 py-1 text-xs font-medium text-black/70"
                            style={{ backgroundColor: task.label_color }}
                          >
                            {task.label}
                          </span>
                        </td>
                        <td className="py-4 pr-6 align-middle">
                          <span 
                            className="rounded-full px-3 py-1 text-xs font-medium"
                            style={{ backgroundColor: statusStyle.bg, color: statusStyle.text }}
                          >
                            {statusStyle.label}
                          </span>
                        </td>
                        <td className="py-4 align-middle">
                          <div className="flex -space-x-2">
                            {task.assignments.slice(0, 3).map((assignment, idx) => (
                              <span key={idx} className={AVATAR_STYLES.small}>
                                <Image
                                  src="/images/default-avatar.svg"
                                  alt={`${assignment.assignee.display_name} avatar`}
                                  width={32}
                                  height={32}
                                  className="h-full w-full object-cover"
                                />
                              </span>
                            ))}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </Section>

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
                  <ProjectAnnouncementCard key={announcement.id} announcement={announcement} compact />
                ))}
              </div>
            )}
          </div>
        </section>
      </div>

      <div className="space-y-14">
        <Section title="Recent Activity" delay={240}>
          <div className="space-y-7 text-xs md:text-sm text-black/80">
            <ActivityItem
              name="Sunny Vinay"
              time="9:05 AM"
              action={<>Created task <TaskLink>"Design onboarding flow"</TaskLink></>}
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
              action={<>Updated status of <TaskLink>"Landing page redesign"</TaskLink> to In Progress</>}
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
    </div>
  );
}
