"use client";

import React, { useState, useEffect, useMemo } from "react";
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
    countText: 'text-cl-blue-700/60',
    icon: StatusIcon.circleOutline,
  },
  in_progress: {
    name: 'In Progress',
    bandBg: 'bg-cl-pink-100',
    bandText: 'text-cl-pink-700',
    countText: 'text-cl-pink-700/60',
    icon: StatusIcon.halfCircle,
  },
  in_review: {
    name: 'In Review',
    bandBg: 'bg-cl-lime-100',
    bandText: 'text-cl-lime-700',
    countText: 'text-cl-lime-700/60',
    icon: StatusIcon.eye,
  },
  done: {
    name: 'Done',
    bandBg: 'bg-cl-mint-100',
    bandText: 'text-cl-mint-700',
    countText: 'text-cl-mint-700/60',
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
          <span className="font-display text-[14px] font-bold uppercase tracking-[0.04em]">
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
  title: string;
  tag?: string;
  tagColor?: string;
  assignees?: Assignee[];
  dueDate?: string;
  isOverdue?: boolean;
  delay?: number;
  onEdit?: () => void;
  onMarkComplete?: () => void;
  onDelete?: () => void;
  canEdit?: boolean;
  isCompleted?: boolean;
}

function BoardCard({
  title,
  tag,
  tagColor,
  assignees = [],
  dueDate,
  isOverdue,
  delay = 0,
  onEdit,
  onMarkComplete,
  onDelete,
  canEdit = false,
  isCompleted = false,
}: BoardCardProps) {
  const mounted = useMountAnimation(delay);
  const enter = mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2';

  return (
    <article
      className={`group flex flex-col gap-2.5 rounded-2xl border-[1.5px] border-ink-200 bg-white px-4 py-3.5 shadow-card transition-all duration-fast ease-out hover:-translate-y-0.5 hover:border-ink-300 hover:shadow-card-hover ${enter}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      <div className="flex items-start justify-between gap-2">
        <h4 className="min-w-0 text-[15px] font-semibold leading-[1.35] text-ink-900">
          {title}
        </h4>
        {onEdit && onMarkComplete && onDelete ? (
          <div className="-mr-1 -mt-1 flex-shrink-0">
            <TaskActionsMenu
              onEdit={onEdit}
              onMarkComplete={onMarkComplete}
              onDelete={onDelete}
              canEdit={canEdit}
              isCompleted={isCompleted}
            />
          </div>
        ) : null}
      </div>

      {(tag || dueDate) && (
        <div className="flex items-center justify-between gap-2">
          {tag ? (
            <span
              className="inline-flex rounded-md px-2 py-0.5 font-code text-[10px] uppercase tracking-[0.06em] text-ink-900"
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
  const { updateTaskAction, deleteTaskAction, isUpdating } = useTaskActions(projectId, currentUserId);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<TaskWithAssignments | null>(null);

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
                    title={task.name}
                    tag={task.label}
                    tagColor={task.label_color}
                    assignees={getAssigneeInfo(task)}
                    dueDate={formatDate(task.due_date)}
                    isOverdue={isOverdueDate(task.due_date, task.status)}
                    delay={idx * 60}
                    onEdit={() => handleEditTask(task)}
                    onMarkComplete={() => handleMarkComplete(task)}
                    onDelete={() => handleDeleteTask(task)}
                    canEdit={canCreateTasks}
                    isCompleted={task.status === 'done'}
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
          task={editingTask}
          isSubmitting={isUpdating}
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
