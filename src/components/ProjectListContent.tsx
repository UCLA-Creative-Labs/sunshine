"use client";

import React, { useState, useEffect } from "react";
import { useTasks } from '@/lib/hooks/useTasks';
import { useCreateTask } from '@/lib/hooks/useCreateTask';
import { useProjectMembers } from '@/lib/hooks/useProjectMembers';
import { useUserRole } from '@/lib/hooks/useUserRole';
import { AddTaskModal } from './tasks/AddTaskModal';
import { CreateTaskInput } from '@/lib/types/tasks';
import { TaskStatus } from '@/lib/types/database';

type StatusId = "todo" | "in_progress" | "in_review" | "done";
type Priority = "low" | "medium" | "high";

function useMountAnimation(delay: number) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const timeout = setTimeout(() => setMounted(true), delay);
    return () => clearTimeout(timeout);
  }, [delay]);

  return mounted;
}

interface ListTask {
  id: string;
  name: string;
  status: StatusId;
  statusLabel: string;
  dueDate: string;
  assignees: string[];
  priority: Priority;
  label: string;
  labelColor: string;
}

const STATUS_META: Record<StatusId, { label: string; bandBg: string; textColor: string; dotColor: string; borderColor: string }> = {
  "todo": {
    label: "Todo",
    bandBg: "#FFE7EA",
    textColor: "#E1225C",
    dotColor: "bg-[#E1225C]",
    borderColor: "#FFCDD2",
  },
  "in_progress": {
    label: "In Progress",
    bandBg: "#E6F8ED",
    textColor: "#00C853",
    dotColor: "bg-[#00C853]",
    borderColor: "#C8E6C9",
  },
  "in_review": {
    label: "In Review",
    bandBg: "#FFF3DC",
    textColor: "#FF9100",
    dotColor: "bg-[#FF9100]",
    borderColor: "#FFE0B2",
  },
  "done": {
    label: "Done",
    bandBg: "#ECE3FF",
    textColor: "#6200EA",
    dotColor: "bg-[#6200EA]",
    borderColor: "#D1C4E9",
  },
};

// helper to map database task status to ui status id
function mapTaskStatusToStatusId(status: TaskStatus): StatusId {
  return status as StatusId;
}

// helper to get assignee initials from display name
function getInitials(displayName: string): string {
  return displayName
    .split(' ')
    .map(word => word[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

function AssigneeGroup({ assignees }: { assignees: string[] }) {
  return (
    <div className="flex -space-x-2">
      {assignees.map((initials) => (
        <div
          key={initials}
          className="flex h-7 w-7 items-center justify-center rounded-full border border-white bg-[#E5E7EB] text-[10px] font-semibold text-black/70 shadow-sm"
        >
          {initials}
        </div>
      ))}
    </div>
  );
}

const PRIORITY_STYLES: Record<Priority, { bg: string; dot: string; label: string }> = {
  low: { bg: "bg-[#E5F3FF]", dot: "bg-[#3F86FF]", label: "Low" },
  medium: { bg: "bg-[#FFF3DC]", dot: "bg-[#FF9100]", label: "Medium" },
  high: { bg: "bg-[#FFE7EA]", dot: "bg-[#E1225C]", label: "High" },
};

function PriorityPill({ priority }: { priority: Priority }) {
  const style = PRIORITY_STYLES[priority];

  return (
    <span className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-[11px] font-medium text-black/70 ${style.bg}`}>
      <span className={`h-2 w-2 rounded-full ${style.dot}`} />
      <span>{style.label}</span>
    </span>
  );
}

interface StatusSectionProps {
  status: StatusId;
  tasks: ListTask[];
  isOpen: boolean;
  onToggle: () => void;
  delay?: number;
}

function StatusSection({ status, tasks, isOpen, onToggle, delay = 0 }: StatusSectionProps) {
  const meta = STATUS_META[status];
  const mounted = useMountAnimation(delay);
  const enterClasses = mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4";

  return (
    <section className={`space-y-3 transform transition-all duration-300 ease-out ${enterClasses}`} style={{ transitionDelay: `${delay}ms` }}>
      {/* band + external arrow */}
      <div className="flex items-start gap-3">
        <button
          type="button"
          onClick={onToggle}
          className="mt-1 flex h-6 w-6 items-center justify-center text-black/60 transition-transform duration-150"
        >
          <svg
            className={`h-4 w-4 transform ${isOpen ? "rotate-0" : "-rotate-90"}`}
            viewBox="0 0 20 20"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M5 8L10 13L15 8"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>

        <div className="flex-1 space-y-3">
            <button
              type="button"
              onClick={onToggle}
              className="flex w-full items-center justify-between rounded-xl px-6 py-2 text-left text-sm md:text-base font-semibold shadow-md border transition-all duration-200 ease-out hover:shadow-lg hover:-translate-y-0.5"
              style={{ backgroundColor: meta.bandBg, color: `${meta.textColor}E6`, borderColor: meta.borderColor }}
            >
              <div className="flex items-center gap-3">
                <span className="relative flex h-5 w-5 items-center justify-center">
                  <span className="absolute h-5 w-5 rounded-full bg-white/80 shadow-sm" />
                  <span className={`relative h-2 w-2 rounded-full ${meta.dotColor}`} />
                </span>
                <span className="flex items-baseline gap-2">
                  <span>{meta.label}</span>
                  <span className="text-[14px] font-medium" style={{ color: `${meta.textColor}A6` }}>
                    {tasks.length}
                  </span>
                </span>
              </div>
            </button>

            {/* table */}
            <div
              className={`overflow-hidden transition-all duration-300 ease-out ${
                isOpen && tasks.length > 0
                  ? "max-h-[2000px] opacity-100"
                  : "max-h-0 opacity-0"
              }`}
            >
              {tasks.length > 0 && (
                <div className="overflow-x-auto">
                  <table className="min-w-full table-fixed text-left text-xs md:text-sm text-black/80">
                  <colgroup>
                    <col className="w-[34%]" />
                    <col className="w-[18%]" />
                    <col className="w-[18%]" />
                    <col className="w-[15%]" />
                    <col className="w-[15%]" />
                  </colgroup>
                  <thead className="border-b border-[#E2E4F0] bg-[#F9FAFB]">
                    <tr>
                      <th className="px-6 py-3 font-semibold">Task Name</th>
                      <th className="px-6 py-3 font-semibold">Label</th>
                      <th className="px-6 py-3 font-semibold">Due Date</th>
                      <th className="px-6 py-3 font-semibold">People</th>
                      <th className="px-6 py-3 font-semibold">Priority</th>
                    </tr>
                  </thead>
                <tbody>
                  {tasks.map((task) => (
                    <tr key={task.id} className="border-b border-[#E2E4F0] transition-colors duration-150 hover:bg-gray-50/50 cursor-pointer">
                      <td className="px-6 py-3 align-middle">
                        <div className="flex items-center h-full">
                          <span className="truncate">{task.name}</span>
                        </div>
                      </td>
                      <td className="px-6 py-3 align-middle">
                        <div className="flex items-center h-full">
                          <span
                            className="inline-flex rounded-full px-2.5 py-0.5 text-[10px] font-medium text-black/70"
                            style={{ backgroundColor: task.labelColor }}
                          >
                            {task.label}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-3 align-middle">
                        <div className="flex items-center h-full">
                          <span className="text-[11px] font-medium text-black/60">
                            {task.dueDate}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-3 align-middle">
                        <div className="flex items-center h-full">
                          <AssigneeGroup assignees={task.assignees} />
                        </div>
                      </td>
                      <td className="px-6 py-3 align-middle">
                        <div className="flex items-center h-full">
                          <PriorityPill priority={task.priority} />
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
  );
}

interface ProjectListContentProps {
  projectId: string;
  currentUserId: string;
}

// TODO: make sure to have route protection
export default function ProjectListContent({ projectId, currentUserId }: ProjectListContentProps) {
  // fetch tasks and project members
  const { tasks: dbTasks, isLoading, error, refetch } = useTasks(projectId);
  const { members } = useProjectMembers(projectId);
  const { isCreating, error: createError, createTaskWithAssignees } = useCreateTask();
  const { canCreateTasks } = useUserRole(projectId, currentUserId);

  // modal state
  const [isModalOpen, setIsModalOpen] = useState(false);

  const assigneeOptions = members.map((m) => ({
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

  // transform db tasks to list tasks
  const listTasks: ListTask[] = dbTasks.map(task => ({
    id: task.id.toString(),
    name: task.name,
    status: mapTaskStatusToStatusId(task.status),
    statusLabel: task.label,
    dueDate: task.due_date 
      ? new Date(task.due_date).toLocaleDateString('en-US', {
          year: 'numeric',
          month: '2-digit',
          day: '2-digit',
        }).replace(/\//g, '/')
      : 'no due date',
    assignees: task.assignments.map(a => getInitials(a.assignee.display_name)),
    priority: task.priority as Priority,
    label: task.label,
    labelColor: task.label_color,
  }));

  // group tasks by status
  const groups: Record<StatusId, ListTask[]> = {
    "todo": [],
    "in_progress": [],
    "in_review": [],
    "done": [],
  };

  for (const task of listTasks) {
    groups[task.status].push(task);
  }

  const [openSections, setOpenSections] = useState<Record<StatusId, boolean>>({
    "todo": true,
    "in_progress": true,
    "in_review": true,
    "done": true,
  });

  const toggleSection = (status: StatusId) => {
    setOpenSections((prev) => ({
      ...prev,
      [status]: !prev[status],
    }));
  };

  return (
    <div className="flex flex-col gap-8">
      <header className="flex items-center justify-between">
        <div className="space-y-1">
          <p className="text-xs font-medium tracking-[0.18em] text-black/40 uppercase">
            LIST VIEW
          </p>
          <h1 className="text-2xl md:text-3xl font-semibold tracking-tight text-black">
            Tasks
          </h1>
        </div>
        {canCreateTasks && (
          <button 
            onClick={() => setIsModalOpen(true)}
            className="inline-flex items-center gap-2 rounded-full bg-[#3F86FF] px-4 py-2 text-xs md:text-sm font-semibold text-white shadow-md transition-all duration-200 ease-out hover:bg-[#346edd] hover:-translate-y-0.5 hover:shadow-lg"
          >
            <span className="text-base leading-none">+</span>
            <span>Add Task</span>
          </button>
        )}
      </header>

      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <p className="text-sm text-black/50">Loading tasks...</p>
        </div>
      ) : error ? (
        <div className="flex items-center justify-center py-12">
          <p className="text-sm text-red-500">Error loading tasks: {error}</p>
        </div>
      ) : (
        <div className="space-y-6">
          <StatusSection
            status="todo"
            tasks={groups["todo"]}
            isOpen={openSections["todo"]}
            onToggle={() => toggleSection("todo")}
            delay={100}
          />
          <StatusSection
            status="in_progress"
            tasks={groups["in_progress"]}
            isOpen={openSections["in_progress"]}
            onToggle={() => toggleSection("in_progress")}
            delay={200}
          />
          <StatusSection
            status="in_review"
            tasks={groups["in_review"]}
            isOpen={openSections["in_review"]}
            onToggle={() => toggleSection("in_review")}
            delay={300}
          />
          <StatusSection
            status="done"
            tasks={groups["done"]}
            isOpen={openSections["done"]}
            onToggle={() => toggleSection("done")}
            delay={400}
          />
        </div>
      )}

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
