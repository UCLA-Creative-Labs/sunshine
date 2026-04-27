"use client";

import React, { useState, useEffect, useMemo } from "react";
import { useTasks } from '@/lib/hooks/useTasks';
import { useCreateTask } from '@/lib/hooks/useCreateTask';
import { useProjectMembers } from '@/lib/hooks/useProjectMembers';
import { useUserRole } from '@/lib/hooks/useUserRole';
import { useTaskActions } from '@/lib/hooks/useTaskActions';
import { AddTaskModal } from './tasks/AddTaskModal';
import { EditTaskModal } from './tasks/EditTaskModal';
import { TaskContextMenu } from './tasks/TaskContextMenu';
import { ADD_TASK_EVENT } from './AddTaskHeaderButton';
import { Avatar, pickAvatarColor, type AvatarColor } from '@/components/portal/ui';
import {
  CreateTaskAssignmentContext,
  CreateTaskInput,
  UpdateTaskInput,
} from '@/lib/types/tasks';
import { TaskStatus, TaskWithAssignments } from '@/lib/types/database';
import { getProfileDisplayName } from '@/lib/utils/profileName';

type ColumnKey = 'todo' | 'in_progress' | 'in_review' | 'done';

type ColumnStyle = {
  name: string;
  bandBg: string;
  bandText: string;
  countText: string;
  icon: React.ReactNode;
};

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

const COLUMN_STYLES: Record<ColumnKey, ColumnStyle> = {
  todo: {
    name: 'Todo',
    bandBg: 'bg-cl-blue-100',
    bandText: 'text-cl-blue-700',
    countText: 'text-ink-900/50',
    icon: StatusIcon.circleOutline,
  },
  in_progress: {
    name: 'In Progress',
    bandBg: 'bg-cl-pink-100',
    bandText: 'text-cl-pink-700',
    countText: 'text-ink-900/50',
    icon: StatusIcon.halfCircle,
  },
  in_review: {
    name: 'In Review',
    bandBg: 'bg-cl-lime-100',
    bandText: 'text-cl-lime-700',
    countText: 'text-ink-900/50',
    icon: StatusIcon.eye,
  },
  done: {
    name: 'Done',
    bandBg: 'bg-cl-mint-100',
    bandText: 'text-cl-mint-700',
    countText: 'text-ink-900/50',
    icon: StatusIcon.checkCircle,
  },
};

const ADD_TASK_GHOST =
  'mt-1 flex w-full items-center justify-center gap-1.5 rounded-xl border-[1.5px] border-dashed border-ink-300 bg-transparent px-3 py-2.5 font-code text-[11px] uppercase tracking-[0.06em] text-ink-600 transition-colors hover:bg-ink-50 hover:text-ink-900';

function useMountAnimation(delay: number) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    const timeout = setTimeout(() => setMounted(true), delay);
    return () => clearTimeout(timeout);
  }, [delay]);
  return mounted;
}

type Assignee = { id: string; name: string; color: AvatarColor };

interface BoardColumnProps {
  columnKey: ColumnKey;
  count: number;
  children: React.ReactNode;
  delay?: number;
  onAddTask?: () => void;
  isEmpty?: boolean;
}

function BoardColumn({ columnKey, count, children, delay = 0, onAddTask, isEmpty }: BoardColumnProps) {
  const style = COLUMN_STYLES[columnKey];
  const mounted = useMountAnimation(delay);
  const enter = mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-3';

  return (
    <section
      className={`flex min-w-0 flex-1 flex-col gap-3 transition-all duration-300 ease-out ${enter}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      <div
        className={`flex items-center justify-between rounded-2xl px-4 py-2.5 ${style.bandBg} ${style.bandText}`}
      >
        <div className="flex items-center gap-2">
          <span aria-hidden>{style.icon}</span>
          <span className="font-display text-[14px] font-bold tracking-[-0.01em] text-ink-900">
            {style.name}
          </span>
        </div>
        <span className={`font-code text-[12px] ${style.countText}`}>{count}</span>
      </div>

      <div className="flex flex-col gap-3">
        {isEmpty ? (
          <div className="rounded-xl border-[1.5px] border-dashed border-ink-300 bg-transparent px-3 py-8 text-center font-code text-[11px] uppercase tracking-[0.08em] text-ink-400">
            no tasks {columnKey === 'todo' ? 'yet' : `in ${style.name.toLowerCase()}`}
          </div>
        ) : (
          children
        )}
      </div>

      {onAddTask && (
        <button type="button" onClick={onAddTask} className={ADD_TASK_GHOST}>
          <span className="text-sm leading-none">+</span>
          <span>Add Task</span>
        </button>
      )}
    </section>
  );
}

interface BoardCardProps {
  taskId: number;
  status: ColumnKey;
  title: string;
  tag?: string;
  tagColor?: string;
  assignees?: Assignee[];
  dueDate?: string;
  isOverdue?: boolean;
  createdAt?: string;
  delay?: number;
  onSelect?: () => void;
  onRequestMenu?: (x: number, y: number) => void;
}

function BoardCard({
  taskId,
  status,
  title,
  tag,
  tagColor,
  assignees = [],
  dueDate,
  isOverdue,
  createdAt,
  delay = 0,
  onSelect,
  onRequestMenu,
}: BoardCardProps) {
  const mounted = useMountAnimation(delay);
  const enter = mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2';
  const statusIcon = COLUMN_STYLES[status].icon;

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!onSelect) return;
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onSelect();
    }
  };

  const handleContextMenu = (e: React.MouseEvent) => {
    if (!onRequestMenu) return;
    e.preventDefault();
    onRequestMenu(e.clientX, e.clientY);
  };

  return (
    <article
      role={onSelect ? 'button' : undefined}
      tabIndex={onSelect ? 0 : undefined}
      aria-label={onSelect ? `Open task #${taskId}: ${title}` : undefined}
      onClick={onSelect}
      onKeyDown={onSelect ? handleKeyDown : undefined}
      onContextMenu={handleContextMenu}
      className={`group flex flex-col gap-2 rounded-2xl border border-ink-100 bg-white px-4 py-3 shadow-card transition-shadow duration-fast ease-out hover:bg-overlay-hover hover:shadow-card-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cl-blue-700 focus-visible:ring-offset-2 focus-visible:ring-offset-cream-50 ${onSelect ? 'cursor-pointer' : ''} ${enter}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {/* Zone 1: ID left, assignees + actions right */}
      <div className="flex items-center justify-between gap-2">
        <span className="font-code text-[11px] text-ink-400">#{taskId}</span>
        <div className="flex items-center gap-1.5">
          {assignees.length > 0 && (
            <div className="flex -space-x-1.5">
              {assignees.slice(0, 3).map((a) => (
                <div key={a.id} className="ring-2 ring-white rounded-full" title={a.name}>
                  <Avatar name={a.name} color={a.color} size="xs" />
                </div>
              ))}
              {assignees.length > 3 ? (
                <div
                  className="ring-2 ring-white rounded-full flex h-7 w-7 items-center justify-center bg-ink-100 font-code text-[10px] font-semibold text-ink-600"
                  title={assignees.slice(3).map((a) => a.name).join(', ')}
                >
                  +{assignees.length - 3}
                </div>
              ) : null}
            </div>
          )}
        </div>
      </div>

      {/* Zone 2: status icon + title */}
      <div className="flex items-start gap-2">
        <span aria-hidden className="mt-[3px] flex-shrink-0 text-ink-400">
          {statusIcon}
        </span>
        <h4 className="min-w-0 text-[14px] font-medium leading-[1.4] text-ink-900">
          {title}
        </h4>
      </div>

      {/* Zone 3: tag + due date (only if present) */}
      {(tag || dueDate) && (
        <div className="flex items-center justify-between gap-2">
          {tag ? (
            <span
              className="inline-flex rounded-md px-2 py-0.5 font-code text-[10px] tracking-[0.02em] text-ink-900"
              style={tagColor ? { backgroundColor: tagColor } : undefined}
            >
              {tag}
            </span>
          ) : (
            <span />
          )}
          {dueDate ? (
            <span
              className={`font-code text-[11px] ${
                isOverdue ? 'text-cl-pink-700' : 'text-ink-400'
              }`}
            >
              {dueDate}
            </span>
          ) : null}
        </div>
      )}

      {/* Zone 4: footer */}
      {createdAt && (
        <div className="pt-1 font-code text-[10px] text-ink-400">
          Created {createdAt}
        </div>
      )}
    </article>
  );
}

interface ProjectBoardContentProps {
  projectId: string;
  currentUserId: string;
}

export default function ProjectBoardContent({ projectId, currentUserId }: ProjectBoardContentProps) {
  const { tasks: dbTasks, isLoading, error, refetch } = useTasks(projectId);
  const { members } = useProjectMembers(projectId);
  const { isCreating, error: createError, createTaskWithAssignees } = useCreateTask();
  const { canCreateTasks } = useUserRole(projectId, currentUserId);
  const { updateTaskAction, deleteTaskAction, setAssigneesAction, isUpdating } = useTaskActions(projectId, currentUserId);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<TaskWithAssignments | null>(null);
  const [contextMenu, setContextMenu] = useState<{
    task: TaskWithAssignments;
    x: number;
    y: number;
  } | null>(null);

  useEffect(() => {
    const handler = () => {
      if (canCreateTasks) setIsModalOpen(true);
    };
    window.addEventListener(ADD_TASK_EVENT, handler);
    return () => window.removeEventListener(ADD_TASK_EVENT, handler);
  }, [canCreateTasks]);

  const assigneeOptions = members
    .filter((m) => m.user.id !== currentUserId)
    .map((m) => ({
      id: m.user.id,
      display_name: getProfileDisplayName(m.user),
    }));

  const editAssigneeOptions = members.map((m) => ({
    id: m.user.id,
    display_name: getProfileDisplayName(m.user),
  }));

  const handleSetAssignees = async (userIds: string[]) => {
    if (!editingTask) return;
    const success = await setAssigneesAction(String(editingTask.id), userIds);
    if (success) refetch();
  };

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

  const tasksByStatus = useMemo(() => {
    const groups: Record<TaskStatus, TaskWithAssignments[]> = {
      todo: [],
      in_progress: [],
      in_review: [],
      done: [],
    };
    dbTasks.forEach((task) => {
      groups[task.status].push(task);
    });
    return groups;
  }, [dbTasks]);

  const formatDate = (dateString: string | null) => {
    if (!dateString) return undefined;
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    });
  };

  const isOverdueDate = (dateString: string | null, status: TaskStatus) => {
    if (!dateString || status === 'done') return false;
    const due = new Date(dateString);
    const now = new Date();
    now.setHours(0, 0, 0, 0);
    return due.getTime() < now.getTime();
  };

  const getAssigneeInfo = (task: TaskWithAssignments): Assignee[] =>
    task.assignments.map((a) => {
      const name = a.assignee.display_name || a.assignee.email?.split('@')[0] || 'Unknown';
      return {
        id: a.assignee.id,
        name,
        color: pickAvatarColor(name),
      };
    });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <p className="font-code text-[11px] uppercase tracking-[0.12em] text-ink-400">Loading tasks…</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center py-12">
        <p className="font-code text-[11px] uppercase tracking-[0.12em] text-cl-pink-700">
          Error loading tasks: {error}
        </p>
      </div>
    );
  }

  const columns: ColumnKey[] = ['todo', 'in_progress', 'in_review', 'done'];

  return (
    <div className="flex flex-col">
      <div className="w-full overflow-x-auto pb-2">
        <div className="flex min-w-[960px] gap-4">
          {columns.map((key, colIdx) => {
            const tasks = tasksByStatus[key];
            return (
              <BoardColumn
                key={key}
                columnKey={key}
                count={tasks.length}
                isEmpty={tasks.length === 0}
                delay={40 + colIdx * 40}
                onAddTask={canCreateTasks ? () => setIsModalOpen(true) : undefined}
              >
                {tasks.map((task, idx) => (
                  <BoardCard
                    key={task.id}
                    taskId={task.id}
                    status={task.status}
                    title={task.name}
                    tag={task.label}
                    tagColor={task.label_color}
                    assignees={getAssigneeInfo(task)}
                    dueDate={formatDate(task.due_date)}
                    isOverdue={isOverdueDate(task.due_date, task.status)}
                    createdAt={formatDate(task.created_at)}
                    delay={idx * 60}
                    onSelect={() => handleEditTask(task)}
                    onRequestMenu={(x, y) => setContextMenu({ task, x, y })}
                  />
                ))}
              </BoardColumn>
            );
          })}
        </div>
      </div>

      <AddTaskModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleCreateTask}
        projectId={projectId}
        projectMembers={assigneeOptions}
        isSubmitting={isCreating}
      />

      {editingTask ? (
        <EditTaskModal
          isOpen={!!editingTask}
          onClose={() => setEditingTask(null)}
          onSubmit={handleEditSubmit}
          onSetAssignees={handleSetAssignees}
          task={editingTask}
          assigneeOptions={editAssigneeOptions}
          isSubmitting={isUpdating}
        />
      ) : null}

      {contextMenu ? (
        <TaskContextMenu
          x={contextMenu.x}
          y={contextMenu.y}
          canEdit={canCreateTasks}
          isCompleted={contextMenu.task.status === 'done'}
          onEdit={() => handleEditTask(contextMenu.task)}
          onMarkComplete={() => handleMarkComplete(contextMenu.task)}
          onDelete={() => handleDeleteTask(contextMenu.task)}
          onClose={() => setContextMenu(null)}
        />
      ) : null}

      {createError ? (
        <div className="fixed bottom-4 right-4 rounded-lg bg-cl-pink-100 px-4 py-3 font-code text-[11px] uppercase tracking-[0.06em] text-cl-pink-700 shadow-lg">
          Failed to create task: {createError}
        </div>
      ) : null}
    </div>
  );
}
