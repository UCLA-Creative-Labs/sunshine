'use client';

import React, { useEffect, useState, useCallback, useMemo, useRef } from 'react';
import {
  FaGithub,
  FaLink,
  FaArrowRight,
  FaXmark,
  FaChevronRight,
} from 'react-icons/fa6';
import { SiFigma, SiNotion, SiInstagram } from 'react-icons/si';
import { getProjectById } from '@/lib/supabase/projectService';
import {
  getProjectEvents,
  getProjectAnnouncements,
  createEvent,
  createAnnouncement,
} from '@/lib/supabase/eventsService';
import {
  createActivityLogEntry,
  getProjectActivityLog,
  ActivityLogEntry,
} from '@/lib/supabase/activityService';
import {
  getProjectMembers,
  ProjectMemberWithProfile,
} from '@/lib/services/projectMemberService';
import { Project } from '@/types/project';
import {
  ProjectEvent,
  ProjectAnnouncement,
  CreateEventInput,
  CreateAnnouncementInput,
} from '@/types/events';
import { useTasks } from '@/lib/hooks/useTasks';
import { AddEventModal } from './events/AddEventModal';
import { AddAnnouncementModal } from './events/AddAnnouncementModal';
import ProjectEventCard from '@/components/portal/ProjectEventCard';
import { useUserRole } from '@/lib/hooks/useUserRole';
import { Avatar, pickAvatarColor, type AvatarColor } from '@/components/portal/ui';
import { TaskWithAssignments } from '@/lib/types/database';
import {
  formatRelativeTime,
  getActivityComment,
  getActivityMessage,
} from '@/lib/utils/projectOverviewDisplay';

type StatusId = 'todo' | 'in_progress' | 'in_review' | 'done';

const STATUS_ICON: Record<StatusId, { icon: React.ReactNode; tone: string }> = {
  todo: {
    tone: 'text-cl-blue-700',
    icon: (
      <svg width="14" height="14" viewBox="0 0 12 12" fill="none" aria-hidden>
        <circle cx="6" cy="6" r="4.5" stroke="currentColor" strokeWidth="1.5" />
      </svg>
    ),
  },
  in_progress: {
    tone: 'text-cl-pink-700',
    icon: (
      <svg width="14" height="14" viewBox="0 0 12 12" fill="none" aria-hidden>
        <circle cx="6" cy="6" r="4.5" stroke="currentColor" strokeWidth="1.5" />
        <path d="M6 1.5a4.5 4.5 0 0 1 0 9z" fill="currentColor" />
      </svg>
    ),
  },
  in_review: {
    tone: 'text-cl-lime-700',
    icon: (
      <svg width="16" height="14" viewBox="0 0 14 12" fill="none" aria-hidden>
        <path
          d="M7 2C3.5 2 1.3 5 1 6c.3 1 2.5 4 6 4s5.7-3 6-4c-.3-1-2.5-4-6-4z"
          stroke="currentColor"
          strokeWidth="1.3"
        />
        <circle cx="7" cy="6" r="1.8" fill="currentColor" />
      </svg>
    ),
  },
  done: {
    tone: 'text-cl-mint-700',
    icon: (
      <svg width="14" height="14" viewBox="0 0 12 12" fill="none" aria-hidden>
        <circle cx="6" cy="6" r="5.2" fill="currentColor" />
        <path
          d="M3.5 6.2l2 2 3-4"
          stroke="#fff"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },
};

const PRIORITY_STYLES: Record<string, { className: string; label: string }> = {
  low: { className: 'bg-ink-100 text-ink-500', label: 'Low' },
  medium: { className: 'bg-ink-200 text-ink-900', label: 'Medium' },
  high: { className: 'bg-cl-pink-100 text-cl-pink-700', label: 'High' },
  urgent: { className: 'bg-cl-pink-700 text-white', label: 'Urgent' },
};

const MAX_TASKS = 5;
const MAX_EVENTS = 4;
const MAX_ANNOUNCEMENTS = 4;
const MAX_ACTIVITIES = 6;

function useMountAnimation(delay: number) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    const timeout = setTimeout(() => setMounted(true), delay);
    return () => clearTimeout(timeout);
  }, [delay]);
  return mounted;
}

function startOfToday(): number {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return d.getTime();
}

function daysUntil(dateString: string | null): number | null {
  if (!dateString) return null;
  const target = new Date(dateString);
  target.setHours(0, 0, 0, 0);
  const diff = target.getTime() - startOfToday();
  return Math.round(diff / (1000 * 60 * 60 * 24));
}

function dueDateLabel(days: number | null): string {
  if (days === null) return 'no due date';
  if (days < 0) return `${Math.abs(days)}d overdue`;
  if (days === 0) return 'today';
  if (days === 1) return 'tomorrow';
  if (days <= 7) return `in ${days}d`;
  return new Date(Date.now() + days * 86400000).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
  });
}

interface EyebrowHeaderProps {
  label: string;
  sub?: string;
  action?: React.ReactNode;
}

function EyebrowHeader({ label, sub, action }: EyebrowHeaderProps) {
  return (
    <div className="mb-3 flex items-center justify-between gap-3">
      <div className="flex items-baseline gap-2">
        <span className="font-display text-[13px] font-bold uppercase tracking-[0.08em] text-ink-900">
          {label}
        </span>
        {sub ? (
          <span className="font-code text-[10px] uppercase tracking-[0.08em] text-ink-400">
            {sub}
          </span>
        ) : null}
      </div>
      {action ?? null}
    </div>
  );
}

function Section({
  children,
  delay = 0,
  className = '',
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}) {
  const mounted = useMountAnimation(delay);
  const enter = mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2';
  return (
    <section
      className={`transform transition-all duration-300 ease-out ${enter} ${className}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </section>
  );
}

/* ----------------------------------------------------------------
 * Greeting strip — warm opening tone, time-of-day based
 * ---------------------------------------------------------------- */

function greetingFor(hour: number): { hello: string; nudge: string } {
  if (hour < 5) return { hello: 'Burning the midnight oil —', nudge: "here's where things stand" };
  if (hour < 12) return { hello: 'Good morning —', nudge: "here's what's waiting for you" };
  if (hour < 17) return { hello: 'Good afternoon —', nudge: 'keeping the rhythm' };
  if (hour < 21) return { hello: 'Good evening —', nudge: 'wrapping the day' };
  return { hello: 'Late one tonight —', nudge: 'easy does it' };
}

interface GreetingProps {
  openTaskCount: number;
  overdueCount: number;
}

function Greeting({ openTaskCount, overdueCount }: GreetingProps) {
  const [hour, setHour] = useState<number | null>(null);
  useEffect(() => {
    setHour(new Date().getHours());
  }, []);
  const g = greetingFor(hour ?? 10);

  let nudge: React.ReactNode;
  if (overdueCount > 0) {
    nudge = (
      <>
        <span className="text-cl-pink-700">{overdueCount} overdue</span>
        <span className="text-ink-600"> —{' '}{g.nudge.toLowerCase()}</span>
      </>
    );
  } else if (openTaskCount === 0) {
    nudge = <span className="text-ink-600">inbox zero, nicely done</span>;
  } else if (openTaskCount === 1) {
    nudge = (
      <>
        <span className="text-ink-900">1 task</span>
        <span className="text-ink-600"> on your plate</span>
      </>
    );
  } else {
    nudge = (
      <>
        <span className="text-ink-900">{openTaskCount} tasks</span>
        <span className="text-ink-600"> on your plate</span>
      </>
    );
  }

  return (
    <div className="flex flex-col gap-1">
      <p className="font-accent italic text-[15px] text-ink-400">{g.hello}</p>
      <h2 className="font-display text-[28px] font-bold leading-[1.1] tracking-[-0.01em] text-ink-900 md:text-[32px]">
        {nudge}
      </h2>
    </div>
  );
}

/* ----------------------------------------------------------------
 * My Todo — localStorage-backed personal checklist
 * ---------------------------------------------------------------- */

interface TodoItem {
  id: string;
  text: string;
  done: boolean;
  createdAt: number;
}

function useLocalTodos(userId: string): [TodoItem[], (fn: (prev: TodoItem[]) => TodoItem[]) => void] {
  const key = `cl:todos:${userId}`;
  const [todos, setTodos] = useState<TodoItem[]>([]);
  const loadedRef = useRef(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(key);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) setTodos(parsed);
      }
    } catch {
      /* ignore */
    }
    loadedRef.current = true;
  }, [key]);

  const update = useCallback(
    (fn: (prev: TodoItem[]) => TodoItem[]) => {
      setTodos((prev) => {
        const next = fn(prev);
        try {
          localStorage.setItem(key, JSON.stringify(next));
        } catch {
          /* quota or privacy mode — ignore */
        }
        return next;
      });
    },
    [key],
  );

  return [todos, update];
}

function MyTodoSection({ userId }: { userId: string }) {
  const [todos, setTodos] = useLocalTodos(userId);
  const [input, setInput] = useState('');
  const openCount = todos.filter((t) => !t.done).length;

  const addTodo = () => {
    const text = input.trim();
    if (!text) return;
    setTodos((prev) => [
      ...prev,
      { id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`, text, done: false, createdAt: Date.now() },
    ]);
    setInput('');
  };

  const toggleTodo = (id: string) => {
    setTodos((prev) => prev.map((t) => (t.id === id ? { ...t, done: !t.done } : t)));
  };

  const deleteTodo = (id: string) => {
    setTodos((prev) => prev.filter((t) => t.id !== id));
  };

  const sorted = [...todos].sort((a, b) => {
    if (a.done !== b.done) return a.done ? 1 : -1;
    return a.createdAt - b.createdAt;
  });

  return (
    <div>
      <EyebrowHeader
        label="My Todo"
        sub={openCount > 0 ? `${openCount} open` : todos.length > 0 ? 'all clear' : undefined}
      />
      <div className="rounded-2xl border-[1.5px] border-ink-200 bg-white p-1.5">
        {sorted.map((todo) => (
          <div
            key={todo.id}
            className="group flex items-center gap-3 rounded-lg px-2.5 py-2 transition-colors hover:bg-cream-100"
          >
            <button
              type="button"
              onClick={() => toggleTodo(todo.id)}
              aria-label={todo.done ? 'Mark as open' : 'Mark as done'}
              className={`flex h-[18px] w-[18px] flex-shrink-0 items-center justify-center rounded-[5px] border-[1.5px] transition-all ${
                todo.done
                  ? 'border-cl-pink-700 bg-cl-pink-700'
                  : 'border-ink-300 bg-white hover:border-cl-pink-700'
              }`}
            >
              {todo.done ? (
                <svg width="10" height="10" viewBox="0 0 12 12" fill="none" aria-hidden>
                  <path
                    d="M2.5 6.5l2.5 2.5 4.5-5.5"
                    stroke="#fff"
                    strokeWidth="1.75"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              ) : null}
            </button>
            <span
              className={`min-w-0 flex-1 truncate text-[14px] leading-[1.4] transition-colors ${
                todo.done ? 'text-ink-400 line-through' : 'text-ink-900'
              }`}
            >
              {todo.text}
            </span>
            <button
              type="button"
              onClick={() => deleteTodo(todo.id)}
              aria-label="Delete todo"
              className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-md opacity-0 transition-opacity group-hover:opacity-100 hover:bg-ink-100"
            >
              <FaXmark className="h-3 w-3 text-ink-400" />
            </button>
          </div>
        ))}

        <div className="flex items-center gap-3 rounded-lg px-2.5 py-2">
          <span className="flex h-[18px] w-[18px] flex-shrink-0 items-center justify-center rounded-[5px] border-[1.5px] border-dashed border-ink-300 text-ink-400">
            <span className="text-[11px] leading-none">+</span>
          </span>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                addTodo();
              }
            }}
            placeholder={todos.length === 0 ? 'Start with your first todo...' : 'Add a todo...'}
            className="min-w-0 flex-1 bg-transparent text-[14px] text-ink-900 placeholder:text-ink-400 focus:outline-none"
          />
          {input ? (
            <span className="font-code text-[10px] uppercase tracking-[0.08em] text-ink-400">
              ↵ save
            </span>
          ) : null}
        </div>
      </div>
    </div>
  );
}

/* ----------------------------------------------------------------
 * My Task row — scannable, with hover chevron
 * ---------------------------------------------------------------- */

type TaskAssignee = { id: string; name: string; color: AvatarColor };

function getAssignees(task: TaskWithAssignments): TaskAssignee[] {
  return task.assignments.map((a) => {
    const name = a.assignee.display_name || a.assignee.email?.split('@')[0] || 'Unknown';
    return { id: a.assignee.id, name, color: pickAvatarColor(name) };
  });
}

function MyTaskRow({ task }: { task: TaskWithAssignments }) {
  const statusIcon = STATUS_ICON[task.status as StatusId];
  const priority = PRIORITY_STYLES[task.priority] ?? PRIORITY_STYLES.medium;
  const assignees = getAssignees(task);
  const days = daysUntil(task.due_date);
  const isOverdue = days !== null && days < 0 && task.status !== 'done';
  const isDueSoon = days !== null && days >= 0 && days <= 1 && task.status !== 'done';

  return (
    <div
      className={`group flex items-center gap-3 rounded-xl border-[1.5px] px-4 py-2.5 transition-all duration-fast ${
        isOverdue
          ? 'border-cl-pink-100 bg-cl-pink-100/40 hover:bg-cl-pink-100/60 hover:shadow-sm'
          : 'border-ink-200 bg-white hover:bg-cream-100 hover:shadow-sm'
      }`}
    >
      <span className={`flex-shrink-0 ${statusIcon.tone}`} aria-hidden>
        {statusIcon.icon}
      </span>
      <span className="min-w-0 flex-1 truncate text-[14px] font-medium text-ink-900">
        {task.name}
      </span>
      <span
        className="hidden md:inline-flex rounded-md px-2 py-0.5 font-code text-[10px] uppercase tracking-[0.06em] text-ink-900 max-w-[100px] truncate"
        style={{ backgroundColor: task.label_color }}
      >
        {task.label}
      </span>
      <span
        className={`hidden md:inline-block min-w-[80px] text-right font-code text-[11px] uppercase tracking-[0.04em] ${
          isOverdue
            ? 'text-cl-pink-700 font-semibold'
            : isDueSoon
              ? 'text-cl-pink-700'
              : 'text-ink-400'
        }`}
      >
        {dueDateLabel(days)}
      </span>
      <span
        className={`hidden lg:inline-flex items-center justify-center rounded-full px-2 py-0.5 font-code text-[10px] uppercase tracking-[0.06em] ${priority.className}`}
      >
        {priority.label}
      </span>
      {assignees.length > 0 ? (
        <div className="flex -space-x-1.5">
          {assignees.slice(0, 2).map((a) => (
            <div key={a.id} className="ring-2 ring-white rounded-full" title={a.name}>
              <Avatar name={a.name} color={a.color} size="xs" />
            </div>
          ))}
          {assignees.length > 2 && (
            <div className="ring-2 ring-white rounded-full flex h-7 w-7 items-center justify-center bg-ink-100 font-code text-[10px] font-semibold text-ink-600">
              +{assignees.length - 2}
            </div>
          )}
        </div>
      ) : null}
      <FaChevronRight className="h-3 w-3 flex-shrink-0 text-ink-300 transition-all duration-fast group-hover:translate-x-0.5 group-hover:text-ink-600" />
    </div>
  );
}

/* ----------------------------------------------------------------
 * Activity row
 * ---------------------------------------------------------------- */

function ActivityRow({ activity }: { activity: ActivityLogEntry }) {
  const name = activity.actorDisplayName || 'Someone';
  const comment = getActivityComment(activity.metadata);
  return (
    <div className="flex items-start gap-3 border-b border-ink-200 py-3 last:border-b-0">
      <div className="mt-0.5 flex-shrink-0">
        <Avatar name={name} color={pickAvatarColor(name)} size="xs" />
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-[13px] leading-[1.5] text-ink-900">
          <span className="font-semibold">{name}</span>{' '}
          <span className="text-ink-600">{getActivityMessage(activity)}</span>
        </p>
        {comment ? (
          <p className="mt-1 truncate font-code text-[11px] text-ink-400">{comment}</p>
        ) : null}
      </div>
      <span className="flex-shrink-0 font-code text-[10px] uppercase tracking-[0.06em] text-ink-400">
        {formatRelativeTime(activity.created_at)}
      </span>
    </div>
  );
}

/* ----------------------------------------------------------------
 * Main
 * ---------------------------------------------------------------- */

interface MyProjectContentProps {
  projectId: string;
  currentUserId: string;
}

export default function MyProjectContent({
  projectId,
  currentUserId,
}: MyProjectContentProps) {
  const { canPostEvents } = useUserRole(projectId, currentUserId);
  const {
    tasks: allTasks,
    isLoading: isTasksLoading,
    error: tasksError,
  } = useTasks(projectId);

  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [projectLeads, setProjectLeads] = useState<ProjectMemberWithProfile[]>([]);
  const [memberCount, setMemberCount] = useState(0);

  const [events, setEvents] = useState<ProjectEvent[]>([]);
  const [announcements, setAnnouncements] = useState<ProjectAnnouncement[]>([]);
  const [activities, setActivities] = useState<ActivityLogEntry[]>([]);
  const [isActivityLoading, setIsActivityLoading] = useState(true);

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
        setError('Failed to load project data');
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

  const fetchActivities = useCallback(async () => {
    setIsActivityLoading(true);
    try {
      const data = await getProjectActivityLog(projectId, MAX_ACTIVITIES);
      setActivities(data);
    } finally {
      setIsActivityLoading(false);
    }
  }, [projectId]);

  const myTasks = useMemo(
    () =>
      allTasks
        .filter((task) =>
          task.assignments.some((assignment) => assignment.user_id === currentUserId),
        )
        .filter((task) => task.status !== 'done')
        .sort((a, b) => {
          if (a.due_date && b.due_date) {
            return new Date(a.due_date).getTime() - new Date(b.due_date).getTime();
          }
          if (a.due_date) return -1;
          if (b.due_date) return 1;
          return a.sort_order - b.sort_order;
        }),
    [allTasks, currentUserId],
  );

  const myOverdueCount = useMemo(
    () =>
      myTasks.filter((t) => {
        const d = daysUntil(t.due_date);
        return d !== null && d < 0;
      }).length,
    [myTasks],
  );

  useEffect(() => {
    fetchEvents();
    fetchAnnouncements();
    fetchActivities();
    getProjectMembers(projectId).then((result) => {
      if (result.success && result.data) {
        setMemberCount(result.data.length);
        setProjectLeads(
          result.data.filter(
            (m) => m.rbac_role?.name?.toLowerCase() === 'project lead',
          ),
        );
      }
    });
  }, [fetchAnnouncements, fetchEvents, fetchActivities, projectId]);

  const handleCreateEvent = async (input: CreateEventInput) => {
    setIsSubmitting(true);
    try {
      const result = await createEvent(input);
      if (result.error) throw new Error(result.error);
      if (result.data) {
        await createActivityLogEntry({
          action: 'created_event',
          projectId,
          userId: currentUserId,
          metadata: {
            event_title: result.data.title,
            event_date: result.data.event_date,
          },
        });
      }
      await Promise.all([fetchEvents(), fetchActivities()]);
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
      const announcement = await createAnnouncement(input);
      if (announcement) {
        await createActivityLogEntry({
          action: 'created_announcement',
          projectId,
          userId: currentUserId,
          metadata: { announcement_title: announcement.title },
        });
      }
      await Promise.all([fetchAnnouncements(), fetchActivities()]);
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
        <p className="font-code text-[11px] uppercase tracking-[0.08em] text-ink-400">
          loading project...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center py-20">
        <p className="font-code text-[11px] uppercase tracking-[0.08em] text-cl-pink-700">
          {error}
        </p>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="flex items-center justify-center py-20">
        <p className="font-code text-[11px] uppercase tracking-[0.08em] text-ink-400">
          no project found.
        </p>
      </div>
    );
  }

  type LinkEntry = {
    key: string;
    label: string;
    url: string;
    Icon: React.ComponentType<{ className?: string }>;
  };
  const projectLinks: LinkEntry[] = [
    project.githubUrl ? { key: 'github', label: 'GitHub', url: project.githubUrl, Icon: FaGithub } : null,
    project.figmaUrl ? { key: 'figma', label: 'Figma', url: project.figmaUrl, Icon: SiFigma } : null,
    project.notionUrl ? { key: 'notion', label: 'Notion', url: project.notionUrl, Icon: SiNotion } : null,
    project.prototypeUrl
      ? { key: 'prototype', label: 'Prototype', url: project.prototypeUrl, Icon: FaLink }
      : null,
    project.demoDayUrl
      ? { key: 'demo', label: 'Demo Day', url: project.demoDayUrl, Icon: FaLink }
      : null,
    project.instaPostUrl
      ? { key: 'insta', label: 'Instagram', url: project.instaPostUrl, Icon: SiInstagram }
      : null,
  ].filter(Boolean) as LinkEntry[];

  return (
    <div className="flex flex-col gap-8">
      {/* Greeting — warm opener */}
      <Section delay={0}>
        <Greeting openTaskCount={myTasks.length} overdueCount={myOverdueCount} />
      </Section>

      {/* 2-col */}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-[minmax(0,2fr)_minmax(280px,1fr)]">
        {/* Main column — personal work + project surface */}
        <div className="flex flex-col gap-8">
          {/* My Tasks */}
          <Section delay={60}>
            <EyebrowHeader
              label="My Tasks"
              action={
                <a
                  href={`/portal/projects/${projectId}/list`}
                  className="flex items-center gap-1 font-code text-[11px] uppercase tracking-[0.06em] text-ink-400 transition-colors hover:text-ink-900"
                >
                  <span>view all</span>
                  <FaArrowRight className="h-2.5 w-2.5" />
                </a>
              }
            />
            {isTasksLoading ? (
              <p className="font-accent italic text-[13px] text-ink-400">loading your tasks...</p>
            ) : tasksError ? (
              <p className="font-code text-[11px] uppercase tracking-[0.08em] text-cl-pink-700">
                failed to load tasks
              </p>
            ) : myTasks.length === 0 ? (
              <div className="rounded-2xl border-[1.5px] border-ink-200 bg-cream-100/50 px-5 py-8 text-center">
                <p className="font-accent italic text-[15px] text-ink-600">
                  nothing assigned —{' '}
                </p>
                <p className="mt-1 text-[14px] text-ink-900">
                  grab something from the{' '}
                  <a
                    href={`/portal/projects/${projectId}/board`}
                    className="font-semibold text-cl-blue-700 hover:text-cl-blue-800"
                  >
                    board
                  </a>
                </p>
              </div>
            ) : (
              <div className="flex flex-col gap-1.5">
                {myTasks.slice(0, MAX_TASKS).map((task) => (
                  <MyTaskRow key={task.id} task={task} />
                ))}
                {myTasks.length > MAX_TASKS && (
                  <a
                    href={`/portal/projects/${projectId}/list`}
                    className="mt-1 flex items-center justify-center gap-1.5 rounded-xl border-[1.5px] border-dashed border-ink-300 bg-transparent px-4 py-2.5 font-code text-[11px] uppercase tracking-[0.06em] text-ink-600 transition-colors hover:border-ink-400 hover:bg-cream-100 hover:text-ink-900"
                  >
                    <span>+{myTasks.length - MAX_TASKS} more</span>
                    <FaArrowRight className="h-2.5 w-2.5" />
                  </a>
                )}
              </div>
            )}
          </Section>

          {/* My Todo — personal, localStorage */}
          <Section delay={120}>
            <MyTodoSection userId={currentUserId} />
          </Section>

          {/* Announcements */}
          <Section delay={180}>
            <EyebrowHeader
              label="Announcements"
              action={
                canPostEvents ? (
                  <button
                    type="button"
                    onClick={() => setShowAnnouncementModal(true)}
                    className="flex items-center gap-1.5 rounded-md border-[1.5px] border-ink-200 bg-white px-3 py-1.5 font-code text-[11px] uppercase tracking-[0.06em] text-ink-600 transition-colors hover:border-ink-300 hover:text-ink-900"
                  >
                    <span className="text-sm leading-none">+</span>
                    <span>add</span>
                  </button>
                ) : null
              }
            />
            {announcements.length === 0 ? (
              <div className="rounded-2xl border-[1.5px] border-ink-200 bg-cream-100/50 px-5 py-6 text-center">
                <p className="font-accent italic text-[14px] text-ink-500">quiet around here</p>
              </div>
            ) : (
              <div className="flex flex-col gap-2">
                {announcements.slice(0, MAX_ANNOUNCEMENTS).map((a) => {
                  const publishDate = a.publish_date
                    ? new Date(a.publish_date).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                      })
                    : null;
                  return (
                    <div
                      key={a.id}
                      className={`flex items-start gap-3 rounded-xl border-[1.5px] px-4 py-3 transition-colors ${
                        a.is_pinned
                          ? 'border-cl-pink-100 bg-cl-pink-100/30 hover:bg-cl-pink-100/50'
                          : 'border-ink-200 bg-white hover:bg-cream-100'
                      }`}
                    >
                      <span
                        aria-hidden
                        className={`mt-2 h-1.5 w-1.5 flex-shrink-0 rounded-full ${
                          a.is_pinned ? 'bg-cl-pink-700' : 'bg-cl-blue-700'
                        }`}
                      />
                      <div className="min-w-0 flex-1">
                        <div className="flex items-baseline justify-between gap-3">
                          <h4 className="truncate text-[14px] font-semibold text-ink-900">
                            {a.title}
                          </h4>
                          {publishDate ? (
                            <span className="flex-shrink-0 font-code text-[10px] uppercase tracking-[0.06em] text-ink-400">
                              {publishDate}
                            </span>
                          ) : null}
                        </div>
                        {a.description ? (
                          <p className="mt-0.5 line-clamp-2 text-[13px] leading-[1.5] text-ink-600">
                            {a.description}
                          </p>
                        ) : null}
                      </div>
                    </div>
                  );
                })}
                {announcements.length > MAX_ANNOUNCEMENTS && (
                  <p className="mt-1 text-center font-code text-[10px] uppercase tracking-[0.08em] text-ink-400">
                    +{announcements.length - MAX_ANNOUNCEMENTS} older
                  </p>
                )}
              </div>
            )}
          </Section>
        </div>

        {/* Sidebar — project context */}
        <div className="flex flex-col gap-8">
          <Section delay={80}>
            <EyebrowHeader label="Team" />
            <div className="rounded-2xl border-[1.5px] border-ink-200 bg-white p-4">
              <div className="mb-3 flex flex-col gap-3">
                {projectLeads.length > 0 ? (
                  projectLeads.slice(0, 4).map((member) => (
                    <div key={member.user_id} className="flex items-center gap-3">
                      <Avatar
                        name={member.user.display_name || 'Unknown'}
                        color={pickAvatarColor(member.user.display_name || 'Unknown')}
                        size="sm"
                      />
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-[13px] font-semibold text-ink-900">
                          {member.user.display_name || 'Unknown'}
                        </p>
                        <p className="font-code text-[10px] uppercase tracking-[0.08em] text-ink-400">
                          Project Lead
                        </p>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="font-accent italic text-[13px] text-ink-400">
                    no leads assigned
                  </p>
                )}
              </div>
              <a
                href={`/portal/projects/${projectId}/members`}
                className="flex items-center justify-between border-t-[1.5px] border-ink-200 pt-3 font-code text-[11px] uppercase tracking-[0.06em] text-ink-600 transition-colors hover:text-ink-900"
              >
                <span>all {memberCount} members</span>
                <FaArrowRight className="h-2.5 w-2.5" />
              </a>
            </div>
          </Section>

          <Section delay={140}>
            <EyebrowHeader
              label="Upcoming Events"
              action={
                canPostEvents ? (
                  <button
                    type="button"
                    onClick={() => setShowEventModal(true)}
                    className="flex items-center gap-1.5 rounded-md border-[1.5px] border-ink-200 bg-white px-3 py-1.5 font-code text-[11px] uppercase tracking-[0.06em] text-ink-600 transition-colors hover:border-ink-300 hover:text-ink-900"
                  >
                    <span className="text-sm leading-none">+</span>
                    <span>add</span>
                  </button>
                ) : null
              }
            />
            {events.length === 0 ? (
              <div className="rounded-2xl border-[1.5px] border-ink-200 bg-cream-100/50 px-4 py-6 text-center">
                <p className="font-accent italic text-[13px] text-ink-500">nothing scheduled</p>
              </div>
            ) : (
              <div className="flex flex-col gap-2">
                {events.slice(0, MAX_EVENTS).map((event) => (
                  <ProjectEventCard key={event.id} event={event} compact />
                ))}
                {events.length > MAX_EVENTS && (
                  <p className="mt-1 text-center font-code text-[10px] uppercase tracking-[0.08em] text-ink-400">
                    +{events.length - MAX_EVENTS} more
                  </p>
                )}
              </div>
            )}
          </Section>

          {projectLinks.length > 0 && (
            <Section delay={200}>
              <EyebrowHeader label="Links" />
              <div className="rounded-2xl border-[1.5px] border-ink-200 bg-white p-2">
                {projectLinks.map(({ key, label, url, Icon }) => (
                  <a
                    key={key}
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex items-center gap-3 rounded-lg px-3 py-2 transition-colors hover:bg-cream-100"
                  >
                    <span className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-md bg-ink-100 transition-colors group-hover:bg-ink-200">
                      <Icon className="h-3.5 w-3.5 text-ink-900" />
                    </span>
                    <span className="min-w-0 flex-1 truncate text-[13px] font-medium text-ink-900">
                      {label}
                    </span>
                    <FaArrowRight className="h-2.5 w-2.5 flex-shrink-0 text-ink-300 transition-all group-hover:translate-x-0.5 group-hover:text-ink-600" />
                  </a>
                ))}
              </div>
            </Section>
          )}
        </div>
      </div>

      {/* Activity feed — full width at bottom */}
      <Section delay={260}>
        <EyebrowHeader label="Activity" />
        {isActivityLoading ? (
          <p className="font-accent italic text-[13px] text-ink-400">loading activity...</p>
        ) : activities.length === 0 ? (
          <div className="rounded-2xl border-[1.5px] border-ink-200 bg-cream-100/50 px-5 py-6 text-center">
            <p className="font-accent italic text-[14px] text-ink-500">
              nothing yet — first edit sets the rhythm
            </p>
          </div>
        ) : (
          <div className="rounded-2xl border-[1.5px] border-ink-200 bg-white px-5 py-2">
            {activities.map((activity) => (
              <ActivityRow key={activity.id} activity={activity} />
            ))}
          </div>
        )}
      </Section>

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
