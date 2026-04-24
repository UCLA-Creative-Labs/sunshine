"use client";

import React, { useState, useEffect } from "react";
import { useTasks } from '@/lib/hooks/useTasks';
import { useCreateTask } from '@/lib/hooks/useCreateTask';
import { useProjectMembers } from '@/lib/hooks/useProjectMembers';
import { useUserRole } from '@/lib/hooks/useUserRole';
import { useTaskActions } from '@/lib/hooks/useTaskActions';
import { AddTaskModal } from './tasks/AddTaskModal';
import { EditTaskModal } from './tasks/EditTaskModal';
import { TaskActionsMenu } from './tasks/TaskActionsMenu';
import { ADD_TASK_EVENT } from './AddTaskHeaderButton';
import { Avatar, pickAvatarColor, type AvatarColor } from '@/components/portal/ui';
import {
  CreateTaskAssignmentContext,
  CreateTaskInput,
  UpdateTaskInput,
} from '@/lib/types/tasks';
import { TaskStatus, TaskWithAssignments } from '@/lib/types/database';
import { getProfileDisplayName } from '@/lib/utils/profileName';

type StatusId = "todo" | "in_progress" | "in_review" | "done";
type Priority = "low" | "medium" | "high" | "urgent";

function useMountAnimation(delay: number) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    const timeout = setTimeout(() => setMounted(true), delay);
    return () => clearTimeout(timeout);
  }, [delay]);
  return mounted;
}

interface Assignee {
  id: string;
  name: string;
  color: AvatarColor;
}

interface ListTask {
  id: string;
  name: string;
  status: StatusId;
  dueDate?: string;
  assignees: Assignee[];
  priority: Priority;
  label: string;
  labelColor: string;
}

const StatusIcon = {
  circleOutline: (
    <svg width="14" height="14" viewBox="0 0 12 12" fill="none" aria-hidden>
      <circle cx="6" cy="6" r="4.5" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  ),
  halfCircle: (
    <svg width="14" height="14" viewBox="0 0 12 12" fill="none" aria-hidden>
      <circle cx="6" cy="6" r="4.5" stroke="currentColor" strokeWidth="1.5" />
      <path d="M6 1.5a4.5 4.5 0 0 1 0 9z" fill="currentColor" />
    </svg>
  ),
  eye: (
    <svg width="16" height="14" viewBox="0 0 14 12" fill="none" aria-hidden>
      <path
        d="M7 2C3.5 2 1.3 5 1 6c.3 1 2.5 4 6 4s5.7-3 6-4c-.3-1-2.5-4-6-4z"
        stroke="currentColor"
        strokeWidth="1.3"
      />
      <circle cx="7" cy="6" r="1.8" fill="currentColor" />
    </svg>
  ),
  checkCircle: (
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
};

const STATUS_META: Record<StatusId, {
  label: string;
  bandBg: string;
  bandText: string;
  countText: string;
  rowHover: string;
  icon: React.ReactNode;
  dotColor: string;
}> = {
  todo: {
    label: "Todo",
    bandBg: "bg-cl-blue-100",
    bandText: "text-cl-blue-700",
    countText: "text-cl-blue-700/60",
    rowHover: "hover:bg-cl-blue-100/40",
    icon: StatusIcon.circleOutline,
    dotColor: "text-cl-blue-700",
  },
  in_progress: {
    label: "In Progress",
    bandBg: "bg-cl-pink-100",
    bandText: "text-cl-pink-700",
    countText: "text-cl-pink-700/60",
    rowHover: "hover:bg-cl-pink-100/40",
    icon: StatusIcon.halfCircle,
    dotColor: "text-cl-pink-700",
  },
  in_review: {
    label: "In Review",
    bandBg: "bg-cl-lime-100",
    bandText: "text-cl-lime-700",
    countText: "text-cl-lime-700/60",
    rowHover: "hover:bg-cl-lime-100/40",
    icon: StatusIcon.eye,
    dotColor: "text-cl-lime-700",
  },
  done: {
    label: "Done",
    bandBg: "bg-cl-mint-100",
    bandText: "text-cl-mint-700",
    countText: "text-cl-mint-700/60",
    rowHover: "hover:bg-cl-mint-100/40",
    icon: StatusIcon.checkCircle,
    dotColor: "text-cl-mint-700",
  },
};

const PRIORITY_STYLES: Record<Priority, { className: string; label: string }> = {
  low: { className: "bg-ink-100 text-ink-400", label: "Low" },
  medium: { className: "bg-ink-200 text-ink-900", label: "Medium" },
  high: { className: "bg-cl-pink-100 text-cl-pink-700", label: "High" },
  urgent: { className: "bg-cl-pink-700 text-white", label: "Urgent" },
};

function mapTaskStatusToStatusId(status: TaskStatus): StatusId {
  return status as StatusId;
}

function AssigneeGroup({ assignees }: { assignees: Assignee[] }) {
  const visible = assignees.slice(0, 3);
  const overflow = assignees.length - visible.length;
  return (
    <div className="flex -space-x-1.5">
      {visible.map((a) => (
        <div key={a.id} className="ring-2 ring-cream-50 rounded-full" title={a.name}>
          <Avatar name={a.name} color={a.color} size="xs" />
        </div>
      ))}
      {overflow > 0 && (
        <div
          className="ring-2 ring-cream-50 rounded-full flex h-7 w-7 items-center justify-center bg-ink-100 font-code text-[10px] font-semibold text-ink-600"
          title={assignees.slice(3).map((a) => a.name).join(', ')}
        >
          +{overflow}
        </div>
      )}
    </div>
  );
}

function PriorityPill({ priority }: { priority: Priority }) {
  const style = PRIORITY_STYLES[priority] ?? PRIORITY_STYLES.medium;
  return (
    <span
      className={`inline-flex items-center rounded-full px-2 py-0.5 font-code text-[10px] uppercase tracking-[0.06em] ${style.className}`}
    >
      {style.label}
    </span>
  );
}

interface TaskRowProps {
  task: ListTask;
  status: StatusId;
  onEdit: () => void;
  onMarkComplete: () => void;
  onDelete: () => void;
  canEdit: boolean;
}

function TaskRow({ task, status, onEdit, onMarkComplete, onDelete, canEdit }: TaskRowProps) {
  const meta = STATUS_META[status];
  return (
    <div
      className={`group flex items-center gap-3 rounded-xl border-[1.5px] border-ink-200 bg-white px-4 py-2.5 transition-colors duration-fast ${meta.rowHover}`}
    >
      <span className={`flex-shrink-0 ${meta.dotColor}`} aria-hidden>
        {meta.icon}
      </span>
      <span className="min-w-0 flex-1 truncate text-[14px] font-medium text-ink-900">
        {task.name}
      </span>

      <span
        className="hidden sm:inline-flex rounded-md px-2 py-0.5 font-code text-[10px] uppercase tracking-[0.06em] text-ink-900"
        style={{ backgroundColor: task.labelColor }}
      >
        {task.label}
      </span>

      <span className="hidden md:inline-block w-[70px] text-right font-code text-[11px] text-ink-400">
        {task.dueDate ?? '—'}
      </span>

      <div className="hidden lg:block w-[100px]">
        <PriorityPill priority={task.priority} />
      </div>

      <div className="hidden sm:flex w-[84px] justify-end">
        <AssigneeGroup assignees={task.assignees} />
      </div>

      <div className="-mr-1 flex-shrink-0">
        <TaskActionsMenu
          onEdit={onEdit}
          onMarkComplete={onMarkComplete}
          onDelete={onDelete}
          canEdit={canEdit}
          isCompleted={task.status === 'done'}
        />
      </div>
    </div>
  );
}

interface StatusSectionProps {
  status: StatusId;
  tasks: ListTask[];
  isOpen: boolean;
  onToggle: () => void;
  delay?: number;
  onEditTask: (task: TaskWithAssignments) => void;
  onMarkComplete: (task: TaskWithAssignments) => void;
  onDeleteTask: (task: TaskWithAssignments) => void;
  canEdit: boolean;
  dbTasks: TaskWithAssignments[];
}

function StatusSection({
  status,
  tasks,
  isOpen,
  onToggle,
  delay = 0,
  onEditTask,
  onMarkComplete,
  onDeleteTask,
  canEdit,
  dbTasks,
}: StatusSectionProps) {
  const meta = STATUS_META[status];
  const mounted = useMountAnimation(delay);
  const enterClasses = mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2";

  return (
    <section
      className={`flex flex-col gap-2 transform transition-all duration-300 ease-out ${enterClasses}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      <button
        type="button"
        onClick={onToggle}
        className={`flex w-full items-center justify-between rounded-2xl px-4 py-2.5 ${meta.bandBg} ${meta.bandText} focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-cream-50 focus-visible:ring-cl-blue-700`}
        aria-expanded={isOpen}
      >
        <div className="flex items-center gap-2">
          <span aria-hidden>{meta.icon}</span>
          <span className="font-display text-[14px] font-bold uppercase tracking-[0.04em]">
            {meta.label}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className={`font-code text-[12px] ${meta.countText}`}>{tasks.length}</span>
          <svg
            className={`h-3.5 w-3.5 transition-transform duration-fast ${isOpen ? 'rotate-0' : '-rotate-90'}`}
            viewBox="0 0 20 20"
            fill="none"
            aria-hidden
          >
            <path
              d="M5 8L10 13L15 8"
              stroke="currentColor"
              strokeWidth="1.75"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
      </button>

      <div
        className={`overflow-hidden transition-all duration-300 ease-out ${
          isOpen
            ? 'max-h-[6000px] opacity-100'
            : 'max-h-0 opacity-0'
        }`}
      >
        {tasks.length > 0 ? (
          <div className="flex flex-col gap-1.5 pt-1">
            {tasks.map((task) => {
              const dbTask = dbTasks.find((t) => t.id.toString() === task.id);
              return (
                <TaskRow
                  key={task.id}
                  task={task}
                  status={status}
                  canEdit={canEdit}
                  onEdit={() => dbTask && onEditTask(dbTask)}
                  onMarkComplete={() => dbTask && onMarkComplete(dbTask)}
                  onDelete={() => dbTask && onDeleteTask(dbTask)}
                />
              );
            })}
          </div>
        ) : (
          <div className="mt-1 rounded-xl border-[1.5px] border-dashed border-ink-300 bg-transparent px-4 py-5 text-center font-code text-[11px] uppercase tracking-[0.08em] text-ink-400">
            no {meta.label.toLowerCase()} tasks
          </div>
        )}
      </div>
    </section>
  );
}

interface ProjectListContentProps {
  projectId: string;
  currentUserId: string;
}

export default function ProjectListContent({ projectId, currentUserId }: ProjectListContentProps) {
  const { tasks: dbTasks, isLoading, error, refetch } = useTasks(projectId);
  const { members } = useProjectMembers(projectId);
  const { isCreating, error: createError, createTaskWithAssignees } = useCreateTask();
  const { canCreateTasks } = useUserRole(projectId, currentUserId);
  const { updateTaskAction, deleteTaskAction, isUpdating } = useTaskActions(projectId, currentUserId);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<TaskWithAssignments | null>(null);

  useEffect(() => {
    if (!canCreateTasks) return;
    const handler = () => setIsModalOpen(true);
    window.addEventListener(ADD_TASK_EVENT, handler);
    return () => window.removeEventListener(ADD_TASK_EVENT, handler);
  }, [canCreateTasks]);

  const assigneeOptions = members
    .filter((m) => m.user.id !== currentUserId)
    .map((m) => ({
      id: m.user.id,
      display_name: getProfileDisplayName(m.user),
    }));

  const handleCreateTask = async (
    input: CreateTaskInput,
    assignmentContext: CreateTaskAssignmentContext,
  ) => {
    const result = await createTaskWithAssignees(input, currentUserId, assignmentContext);
    if (result) {
      setIsModalOpen(false);
      refetch();
    }
  };

  const handleDeleteTask = async (task: TaskWithAssignments) => {
    if (!confirm('Are you sure you want to delete this task?')) return;
    const success = await deleteTaskAction(String(task.id), { taskName: task.name });
    if (success) refetch();
  };

  const handleEditTask = (task: TaskWithAssignments) => setEditingTask(task);

  const handleEditSubmit = async (input: UpdateTaskInput) => {
    if (!editingTask) return;
    const success = await updateTaskAction(String(editingTask.id), input, {
      taskName: editingTask.name,
      previousStatus: editingTask.status,
    });
    if (success) {
      setEditingTask(null);
      refetch();
    }
  };

  const handleMarkComplete = async (task: TaskWithAssignments) => {
    const success = await updateTaskAction(String(task.id), { status: 'done' }, {
      taskName: task.name,
      previousStatus: task.status,
    });
    if (success) refetch();
  };

  const listTasks: ListTask[] = dbTasks.map((task) => {
    const dueDate = task.due_date
      ? new Date(task.due_date).toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
        })
      : undefined;
    const assignees: Assignee[] = task.assignments.map((a) => {
      const name = a.assignee.display_name || a.assignee.email?.split('@')[0] || 'Unknown';
      return { id: a.assignee.id, name, color: pickAvatarColor(name) };
    });
    return {
      id: task.id.toString(),
      name: task.name,
      status: mapTaskStatusToStatusId(task.status),
      dueDate,
      assignees,
      priority: task.priority as Priority,
      label: task.label,
      labelColor: task.label_color,
    };
  });

  const groups: Record<StatusId, ListTask[]> = {
    todo: [],
    in_progress: [],
    in_review: [],
    done: [],
  };
  for (const task of listTasks) {
    groups[task.status].push(task);
  }

  const [openSections, setOpenSections] = useState<Record<StatusId, boolean>>({
    todo: true,
    in_progress: true,
    in_review: true,
    done: true,
  });

  const toggleSection = (status: StatusId) => {
    setOpenSections((prev) => ({ ...prev, [status]: !prev[status] }));
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <p className="font-code text-[11px] uppercase tracking-[0.08em] text-ink-400">
          loading tasks...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center py-12">
        <p className="font-code text-[11px] uppercase tracking-[0.08em] text-cl-pink-700">
          error loading tasks: {error}
        </p>
      </div>
    );
  }

  const order: StatusId[] = ['todo', 'in_progress', 'in_review', 'done'];

  return (
    <div className="flex flex-col gap-4">
      {order.map((status, idx) => (
        <StatusSection
          key={status}
          status={status}
          tasks={groups[status]}
          isOpen={openSections[status]}
          onToggle={() => toggleSection(status)}
          delay={40 + idx * 40}
          onEditTask={handleEditTask}
          onMarkComplete={handleMarkComplete}
          onDeleteTask={handleDeleteTask}
          canEdit={canCreateTasks}
          dbTasks={dbTasks}
        />
      ))}

      <AddTaskModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleCreateTask}
        projectId={projectId}
        projectMembers={assigneeOptions}
        isSubmitting={isCreating}
      />

      {editingTask && (
        <EditTaskModal
          isOpen={!!editingTask}
          onClose={() => setEditingTask(null)}
          onSubmit={handleEditSubmit}
          task={editingTask}
          isSubmitting={isUpdating}
        />
      )}

      {createError && (
        <div className="fixed bottom-4 right-4 rounded-lg bg-cl-pink-100 px-4 py-3 font-code text-[11px] uppercase tracking-[0.06em] text-cl-pink-700 shadow-lg">
          failed to create task: {createError}
        </div>
      )}
    </div>
  );
}
