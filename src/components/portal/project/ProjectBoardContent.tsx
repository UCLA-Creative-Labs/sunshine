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
import { GitHubBadge } from './tasks/GitHubBadge';
import { CreateTaskInput, UpdateTaskInput } from '@/lib/types/tasks';
import { TaskStatus, TaskWithAssignments } from '@/lib/types/database';
import { getProfileDisplayName } from '@/lib/utils/profileName';

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
  title: string;
  tag?: string;
  tagColor?: string;
  assignees?: Array<{ id: string; name: string; initials: string }>;
  dueDate?: string;
  delay?: number;
  onEdit?: () => void;
  onMarkComplete?: () => void;
  onDelete?: () => void;
  canEdit?: boolean;
  canPushToGithub?: boolean;
  isCompleted?: boolean;
  githubUrl?: string | null;
  githubIssueNumber?: number | null;
  onPushToGithub?: () => void;
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

function BoardCard({ title, tag, tagColor = "#E5E7EB", assignees = [], dueDate, delay = 0, onEdit, onMarkComplete, onDelete, canEdit = false, canPushToGithub = false, isCompleted = false, githubUrl, githubIssueNumber, onPushToGithub }: BoardCardProps) {
  const mounted = useMountAnimation(delay);
  const enterClasses = mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2";
  const isSingleAssignee = assignees.length === 1;

  return (
    <div
      className={`rounded-2xl bg-white px-4 py-4 shadow-sm border border-white/70 transform transition-all duration-200 ease-out hover:-translate-y-0.5 hover:shadow-md ${enterClasses}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex flex-col gap-1 flex-1 min-w-0 pr-2">
          <p className="text-xs md:text-sm font-medium text-black/80 truncate">{title}</p>
          <GitHubBadge githubUrl={githubUrl} githubIssueNumber={githubIssueNumber} />
        </div>
        {onEdit && onMarkComplete && onDelete && (
          <TaskActionsMenu
            onEdit={onEdit}
            onMarkComplete={onMarkComplete}
            onDelete={onDelete}
            canEdit={canEdit}
            canPushToGithub={canPushToGithub}
            isCompleted={isCompleted}
            githubUrl={githubUrl}
            onPushToGithub={onPushToGithub}
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
        <div className={`mt-3 flex items-center ${isSingleAssignee ? 'gap-2' : '-space-x-2'}`}>
          {assignees.slice(0, 3).map((assignee, idx) => (
            <div
              key={idx}
              className="group relative flex h-6 w-6 items-center justify-center rounded-full border border-white bg-[#E5E7EB] text-[10px] font-semibold text-black/70 hover:z-10 transition-transform hover:scale-110 cursor-default"
            >
              {assignee.initials}
              <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 px-2 py-1 bg-gray-900 text-white text-[10px] rounded whitespace-nowrap opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity duration-200 shadow-lg z-50">
                {assignee.name}
                <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-px border-4 border-transparent border-t-gray-900"></div>
              </div>
            </div>
          ))}
          {isSingleAssignee && assignees[0] && (
            <span className="text-[10px] font-medium text-black/70">
              {assignees[0].name}
            </span>
          )}
          {assignees.length > 3 && (
            <div className="group relative flex h-6 w-6 items-center justify-center rounded-full border border-white bg-[#E5E7EB] text-[10px] font-semibold text-black/70 hover:z-10 transition-transform hover:scale-110 cursor-default">
              +{assignees.length - 3}
              <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 px-2 py-1 bg-gray-900 text-white text-[10px] rounded whitespace-nowrap opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity duration-200 shadow-lg z-50">
                {assignees.slice(3).map(a => a.name).join(', ')}
                <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-px border-4 border-transparent border-t-gray-900"></div>
              </div>
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
  const { updateTaskAction, deleteTaskAction, pushToGithubAction, isUpdating } = useTaskActions();

  // modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<TaskWithAssignments | null>(null);

  const assigneeOptions = members
    .filter((m) => m.user.id !== currentUserId)
    .map((m) => ({
      id: m.user.id,
      display_name: getProfileDisplayName(m.user),
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
  const handleDeleteTask = async (taskId: string, hasGithubIssue: boolean) => {
    if (!confirm('Are you sure you want to delete this task?')) return;

    const success = await deleteTaskAction(taskId, hasGithubIssue);
    if (success) {
      refetch();
    }
  };

  // handle task edit (placeholder for now)
  const handleEditTask = (task: TaskWithAssignments) => {
    setEditingTask(task);
  };

  const handleEditSubmit = async (input: UpdateTaskInput) => {
    if (!editingTask) return;

    const success = await updateTaskAction(String(editingTask.id), input, !!editingTask.github_issue_number);
    if (success) {
      setEditingTask(null);
      refetch();
    }
  };

  const handleMarkComplete = async (task: TaskWithAssignments) => {
    const input: UpdateTaskInput = {
      status: 'done',
    };

    const success = await updateTaskAction(String(task.id), input, !!task.github_issue_number);
    if (success) {
      refetch();
    }
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

  // helper to get assignee info
  const getAssigneeInfo = (task: TaskWithAssignments) => {
    return task.assignments.map(a => ({
      id: a.assignee.id,
      name: a.assignee.display_name || a.assignee.email?.split('@')[0] || 'Unknown',
      initials: (a.assignee.display_name || a.assignee.email?.split('@')[0] || '?')
        .split(' ')
        .map(word => word[0])
        .join('')
        .toUpperCase()
        .slice(0, 2)
    }));
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
          <p className="text-sm font-semibold text-black">Tasks</p>
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
                  title={task.name}
                  tag={task.label}
                  tagColor={task.label_color}
                  assignees={getAssigneeInfo(task)}
                  dueDate={formatDate(task.due_date)}
                  delay={idx * 60}
                  onEdit={() => handleEditTask(task)}
                  onMarkComplete={() => handleMarkComplete(task)}
                  onDelete={() => handleDeleteTask(task.id.toString(), !!task.github_issue_number)}
                  canEdit={canCreateTasks}
                  canPushToGithub={canCreateTasks || (task.assignments ?? []).some(a => a.user_id === currentUserId)}
                  isCompleted={task.status === 'done'}
                  githubUrl={task.github_issue_url}
                  githubIssueNumber={task.github_issue_number}
                  onPushToGithub={() => pushToGithubAction(task.id.toString())}
                />
              ))}
            </BoardColumn>

            <BoardColumn title="In Progress" accentColor="#00C853" delay={80} onAddTask={canCreateTasks ? () => setIsModalOpen(true) : undefined}>
              {tasksByStatus.in_progress.map((task, idx) => (
                <BoardCard
                  key={task.id}
                  title={task.name}
                  tag={task.label}
                  tagColor={task.label_color}
                  assignees={getAssigneeInfo(task)}
                  dueDate={formatDate(task.due_date)}
                  delay={idx * 60}
                  onEdit={() => handleEditTask(task)}
                  onMarkComplete={() => handleMarkComplete(task)}
                  onDelete={() => handleDeleteTask(task.id.toString(), !!task.github_issue_number)}
                  canEdit={canCreateTasks}
                  canPushToGithub={canCreateTasks || (task.assignments ?? []).some(a => a.user_id === currentUserId)}
                  isCompleted={task.status === 'done'}
                  githubUrl={task.github_issue_url}
                  githubIssueNumber={task.github_issue_number}
                  onPushToGithub={() => pushToGithubAction(task.id.toString())}
                />
              ))}
            </BoardColumn>

            <BoardColumn title="In Review" accentColor="#FF9100" delay={120} onAddTask={canCreateTasks ? () => setIsModalOpen(true) : undefined}>
              {tasksByStatus.in_review.map((task, idx) => (
                <BoardCard
                  key={task.id}
                  title={task.name}
                  tag={task.label}
                  tagColor={task.label_color}
                  assignees={getAssigneeInfo(task)}
                  dueDate={formatDate(task.due_date)}
                  delay={idx * 60}
                  onEdit={() => handleEditTask(task)}
                  onMarkComplete={() => handleMarkComplete(task)}
                  onDelete={() => handleDeleteTask(task.id.toString(), !!task.github_issue_number)}
                  canEdit={canCreateTasks}
                  canPushToGithub={canCreateTasks || (task.assignments ?? []).some(a => a.user_id === currentUserId)}
                  isCompleted={task.status === 'done'}
                  githubUrl={task.github_issue_url}
                  githubIssueNumber={task.github_issue_number}
                  onPushToGithub={() => pushToGithubAction(task.id.toString())}
                />
              ))}
            </BoardColumn>

            <BoardColumn title="Done" accentColor="#6200EA" delay={160} onAddTask={canCreateTasks ? () => setIsModalOpen(true) : undefined}>
              {tasksByStatus.done.map((task, idx) => (
                <BoardCard
                  key={task.id}
                  title={task.name}
                  tag={task.label}
                  tagColor={task.label_color}
                  assignees={getAssigneeInfo(task)}
                  dueDate={formatDate(task.due_date)}
                  delay={idx * 60}
                  onEdit={() => handleEditTask(task)}
                  onMarkComplete={() => handleMarkComplete(task)}
                  onDelete={() => handleDeleteTask(task.id.toString(), !!task.github_issue_number)}
                  canEdit={canCreateTasks}
                  canPushToGithub={canCreateTasks || (task.assignments ?? []).some(a => a.user_id === currentUserId)}
                  isCompleted={task.status === 'done'}
                  githubUrl={task.github_issue_url}
                  githubIssueNumber={task.github_issue_number}
                  onPushToGithub={() => pushToGithubAction(task.id.toString())}
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
        <div className="fixed bottom-4 right-4 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600 shadow-lg">
          Failed to create task: {createError}
        </div>
      )}
    </div>
  );
}
