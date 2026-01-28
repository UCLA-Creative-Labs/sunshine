"use client";

import React, { useState, useEffect, useMemo } from "react";
import { useTasks } from '@/lib/hooks/useTasks';
import { useCreateTask } from '@/lib/hooks/useCreateTask';
import { useProjectMembers } from '@/lib/hooks/useProjectMembers';
import { useUserRole } from '@/lib/hooks/useUserRole';
import { useTaskActions } from '@/lib/hooks/useTaskActions';
import { AddTaskModal } from './tasks/AddTaskModal';
import { TaskActionsMenu } from './tasks/TaskActionsMenu';
import { CreateTaskInput } from '@/lib/types/tasks';
import { TaskStatus, TaskWithAssignments } from '@/lib/types/database';

const BUTTON_STYLES = {
  addTask: "mt-1 flex w-full items-center justify-center rounded-xl border border-dashed border-black/15 bg-white/60 px-3 py-2 text-[11px] md:text-xs font-medium text-black/70 transition-all duration-150 ease-out hover:bg-white hover:border-black/30 hover:-translate-y-0.5",
  primary: "inline-flex items-center gap-2 rounded-full bg-[#3F86FF] px-4 py-2 text-xs md:text-sm font-semibold text-white shadow-sm transition-all duration-200 ease-out hover:bg-[#346edd] hover:-translate-y-0.5 hover:shadow-md",
} as const;

function useMountAnimation(delay: number) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const timeout = setTimeout(() => setMounted(true), delay);
    return () => clearTimeout(timeout);
  }, [delay]);

  return mounted;
}

interface BoardColumnProps {
  title: string;
  accentColor: string;
  children: React.ReactNode;
  delay?: number;
  onAddTask?: () => void;
}

function BoardColumn({ title, accentColor, children, delay = 0, onAddTask }: BoardColumnProps) {
  const mounted = useMountAnimation(delay);
  const enterClasses = mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4";

  return (
    <section
      className={`flex-none w-[260px] space-y-3 transform transition-all duration-300 ease-out ${enterClasses}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      <h2
        className="text-base md:text-lg font-semibold tracking-tight"
        style={{ color: accentColor }}
      >
        {title}
      </h2>
      <div className="rounded-3xl bg-[#E5E7EB]/80 px-3 py-4 shadow-md">
        <div className="space-y-3">
          {children}
          {onAddTask && (
            <button type="button" onClick={onAddTask} className={BUTTON_STYLES.addTask}>
              + Add Task
            </button>
          )}
        </div>
      </div>
    </section>
  );
}

interface BoardCardProps {
  taskId: string;
  title: string;
  tag?: string;
  tagColor?: string;
  assignees?: string[];
  dueDate?: string;
  delay?: number;
  onEdit?: () => void;
  onDelete?: () => void;
  canEdit?: boolean;
}

function getInitials(name: string | undefined | null): string {
  if (!name) return "?";
  return name.split(" ").map((part) => part[0]).join("");
}

function AvatarStack({ initials }: { initials: string[] }) {
  return (
    <div className="flex -space-x-2">
      {initials.map((initial, idx) => (
        <div
          key={idx}
          className="flex h-8 w-8 items-center justify-center rounded-full border border-white bg-[#FFEFAE] text-[11px] font-semibold text-black/70 shadow-sm"
        >
          {initial}
        </div>
      ))}
    </div>
  );
}

function BoardCard({ taskId, title, tag, tagColor = "#E5E7EB", assignees = [], dueDate, delay = 0, onEdit, onDelete, canEdit = false }: BoardCardProps) {
  const mounted = useMountAnimation(delay);
  const enterClasses = mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2";

  return (
    <div
      className={`rounded-2xl bg-white px-4 py-4 shadow-sm border border-white/70 transform transition-all duration-200 ease-out hover:-translate-y-0.5 hover:shadow-md ${enterClasses}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      <div className="flex items-start justify-between gap-2">
        <p className="text-xs md:text-sm font-medium text-black/80 truncate flex-1">{title}</p>
        {onEdit && onDelete && (
          <TaskActionsMenu 
            onEdit={onEdit}
            onDelete={onDelete}
            canEdit={canEdit}
          />
        )}
      </div>
      <div className="mt-2 flex items-center justify-between gap-2">
        {tag && (
          <span
            className="inline-flex rounded-full px-2.5 py-0.5 text-[10px] font-medium text-black/70"
            style={{ backgroundColor: tagColor }}
          >
            {tag}
          </span>
        )}
        {dueDate && (
          <span className="text-[10px] text-black/50">Due {dueDate}</span>
        )}
      </div>
      {assignees.length > 0 && (
        <div className="mt-3 flex -space-x-2">
          {assignees.slice(0, 3).map((initials, idx) => (
            <div
              key={idx}
              className="flex h-6 w-6 items-center justify-center rounded-full border border-white bg-[#E5E7EB] text-[10px] font-semibold text-black/70"
            >
              {initials}
            </div>
          ))}
          {assignees.length > 3 && (
            <div className="flex h-6 w-6 items-center justify-center rounded-full border border-white bg-[#E5E7EB] text-[10px] font-semibold text-black/70">
              +{assignees.length - 3}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

interface ProjectBoardContentProps {
  projectId: string;
  currentUserId: string;
}

// TODO: need route protection
export default function ProjectBoardContent({ projectId, currentUserId }: ProjectBoardContentProps) {
  // fetch tasks and project members
  const { tasks: dbTasks, isLoading, error, refetch } = useTasks(projectId);
  const { members } = useProjectMembers(projectId);
  const { isCreating, error: createError, createTaskWithAssignees } = useCreateTask();
  const { canCreateTasks } = useUserRole(projectId, currentUserId);
  const { deleteTaskAction } = useTaskActions();

  // modal state
  const [isModalOpen, setIsModalOpen] = useState(false);

  const assigneeOptions = members
    .filter((m) => m.user.id !== currentUserId)
    .map((m) => ({
      id: m.user.id,
      display_name: m.user.display_name,
    }));

  // handle task creation
  const handleCreateTask = async (input: CreateTaskInput, assigneeIds: string[]) => {
    const result = await createTaskWithAssignees(input, currentUserId, assigneeIds);
    if (result) {
      setIsModalOpen(false);
      refetch();
    }
  };

  // handle task deletion
  const handleDeleteTask = async (taskId: string) => {
    if (!confirm('Are you sure you want to delete this task?')) return;
    
    const success = await deleteTaskAction(taskId);
    if (success) {
      refetch();
    }
  };

  // handle task edit (placeholder for now)
  const handleEditTask = (taskId: string) => {
    // TODO: Implement edit modal
    alert('Edit functionality coming soon!');
  };

  // group tasks by status
  const tasksByStatus = useMemo(() => {
    const groups: Record<TaskStatus, TaskWithAssignments[]> = {
      todo: [],
      in_progress: [],
      in_review: [],
      done: [],
    };

    dbTasks.forEach(task => {
      groups[task.status].push(task);
    });

    return groups;
  }, [dbTasks]);

  // helper to format date
  const formatDate = (dateString: string | null) => {
    if (!dateString) return undefined;
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    });
  };

  // helper to get assignee initials
  const getAssigneeInitials = (task: TaskWithAssignments) => {
    return task.assignments.map(a => 
      a.assignee.display_name
        .split(' ')
        .map(word => word[0])
        .join('')
        .toUpperCase()
        .slice(0, 2)
    );
  };
  const today = useMemo(() => new Date().toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }), []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <p className="text-sm text-black/50">Loading tasks...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center py-12">
        <p className="text-sm text-red-500">Error loading tasks: {error}</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <header className="flex items-center justify-between gap-4 max-w-5xl">
        <div className="space-y-1">
          <p className="text-xs font-medium tracking-[0.18em] text-black/40 uppercase">
            BOARD VIEW
          </p>
          <h1 className="text-2xl md:text-3xl font-semibold tracking-tight text-black">
            Tasks
          </h1>
          <p className="text-[11px] md:text-xs text-black/50">{today}</p>
        </div>
        <div className="flex items-center gap-4">
          <AvatarStack initials={members.slice(0, 3).map(m => getInitials(m.user.display_name))} />
          {canCreateTasks && (
            <button onClick={() => setIsModalOpen(true)} className={BUTTON_STYLES.primary}>
              <span className="text-base leading-none">+</span>
              <span>Add Task</span>
            </button>
          )}
        </div>
      </header>

      <div className="relative w-full">
        <div className="w-full max-w-full overflow-x-auto overflow-y-visible pb-4">
          <div className="flex gap-4 md:gap-6 lg:gap-8 min-w-[1400px]">
            <BoardColumn title="Todo" accentColor="#E1225C" delay={40} onAddTask={canCreateTasks ? () => setIsModalOpen(true) : undefined}>
              {tasksByStatus.todo.map((task, idx) => (
                <BoardCard
                  key={task.id}
                  taskId={task.id.toString()}
                  title={task.name}
                  tag={task.label}
                  tagColor={task.label_color}
                  assignees={getAssigneeInitials(task)}
                  dueDate={formatDate(task.due_date)}
                  delay={idx * 60}
                  onEdit={() => handleEditTask(task.id.toString())}
                  onDelete={() => handleDeleteTask(task.id.toString())}
                  canEdit={canCreateTasks}
                />
              ))}
            </BoardColumn>

            <BoardColumn title="In Progress" accentColor="#00C853" delay={80} onAddTask={canCreateTasks ? () => setIsModalOpen(true) : undefined}>
              {tasksByStatus.in_progress.map((task, idx) => (
                <BoardCard
                  key={task.id}
                  taskId={task.id.toString()}
                  title={task.name}
                  tag={task.label}
                  tagColor={task.label_color}
                  assignees={getAssigneeInitials(task)}
                  dueDate={formatDate(task.due_date)}
                  delay={idx * 60}
                  onEdit={() => handleEditTask(task.id.toString())}
                  onDelete={() => handleDeleteTask(task.id.toString())}
                  canEdit={canCreateTasks}
                />
              ))}
            </BoardColumn>

            <BoardColumn title="In Review" accentColor="#FF9100" delay={120} onAddTask={canCreateTasks ? () => setIsModalOpen(true) : undefined}>
              {tasksByStatus.in_review.map((task, idx) => (
                <BoardCard
                  key={task.id}
                  taskId={task.id.toString()}
                  title={task.name}
                  tag={task.label}
                  tagColor={task.label_color}
                  assignees={getAssigneeInitials(task)}
                  dueDate={formatDate(task.due_date)}
                  delay={idx * 60}
                  onEdit={() => handleEditTask(task.id.toString())}
                  onDelete={() => handleDeleteTask(task.id.toString())}
                  canEdit={canCreateTasks}
                />
              ))}
            </BoardColumn>

            <BoardColumn title="Done" accentColor="#6200EA" delay={160} onAddTask={canCreateTasks ? () => setIsModalOpen(true) : undefined}>
              {tasksByStatus.done.map((task, idx) => (
                <BoardCard
                  key={task.id}
                  taskId={task.id.toString()}
                  title={task.name}
                  tag={task.label}
                  tagColor={task.label_color}
                  assignees={getAssigneeInitials(task)}
                  dueDate={formatDate(task.due_date)}
                  delay={idx * 60}
                  onEdit={() => handleEditTask(task.id.toString())}
                  onDelete={() => handleDeleteTask(task.id.toString())}
                  canEdit={canCreateTasks}
                />
              ))}
            </BoardColumn>
          </div>
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

      {createError && (
        <div className="fixed bottom-4 right-4 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600 shadow-lg">
          Failed to create task: {createError}
        </div>
      )}
    </div>
  );
}
