"use client";

import React, { useCallback, useEffect, useRef, useState } from 'react';
import { UpdateTaskInput, TASK_LABELS } from '@/lib/types/tasks';
import { TaskStatus, TaskPriority, TaskWithAssignments } from '@/lib/types/database';
import { Avatar, cn } from '@/components/portal/ui';

interface AssigneeOption {
  id: string;
  display_name: string;
}

interface EditTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (input: UpdateTaskInput) => Promise<void>;
  onSetAssignees?: (userIds: string[]) => Promise<void>;
  task: TaskWithAssignments;
  assigneeOptions?: AssigneeOption[];
  isSubmitting?: boolean;
}

type StatusOption = {
  value: TaskStatus;
  label: string;
  selected: string;
  unselected: string;
};

const STATUS_OPTIONS: StatusOption[] = [
  {
    value: 'todo',
    label: 'Todo',
    selected: 'border-cl-blue-700 bg-cl-blue-100 text-cl-blue-700',
    unselected: 'border-ink-100 text-ink-600 hover:bg-overlay-hover',
  },
  {
    value: 'in_progress',
    label: 'In progress',
    selected: 'border-cl-pink-700 bg-cl-pink-100 text-cl-pink-700',
    unselected: 'border-ink-100 text-ink-600 hover:bg-overlay-hover',
  },
  {
    value: 'in_review',
    label: 'In review',
    selected: 'border-cl-lime-700 bg-cl-lime-100 text-cl-lime-700',
    unselected: 'border-ink-100 text-ink-600 hover:bg-overlay-hover',
  },
  {
    value: 'done',
    label: 'Done',
    selected: 'border-cl-mint-700 bg-cl-mint-100 text-cl-mint-700',
    unselected: 'border-ink-100 text-ink-600 hover:bg-overlay-hover',
  },
];

const PRIORITY_OPTIONS: { value: TaskPriority; label: string }[] = [
  { value: 'low', label: 'Low' },
  { value: 'medium', label: 'Medium' },
  { value: 'high', label: 'High' },
  { value: 'urgent', label: 'Urgent' },
];

export function EditTaskModal({
  isOpen,
  onClose,
  onSubmit,
  onSetAssignees,
  task,
  assigneeOptions = [],
  isSubmitting = false,
}: EditTaskModalProps) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState<TaskStatus>('todo');
  const [priority, setPriority] = useState<TaskPriority>('medium');
  const [dueDate, setDueDate] = useState('');
  const [labelIndex, setLabelIndex] = useState(0);
  const [nameError, setNameError] = useState<string | null>(null);
  const [assigneeIds, setAssigneeIds] = useState<string[]>([]);
  const [assigneePopoverOpen, setAssigneePopoverOpen] = useState(false);
  const assigneePopoverRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen && task) {
      setName(task.name || '');
      setDescription(task.description || '');
      setStatus(task.status);
      setPriority(task.priority);
      setDueDate(
        task.due_date ? new Date(task.due_date).toISOString().split('T')[0] : '',
      );
      const foundLabelIndex = TASK_LABELS.findIndex((l) => l.name === task.label);
      setLabelIndex(foundLabelIndex >= 0 ? foundLabelIndex : 0);
      setNameError(null);
      setAssigneeIds(task.assignments.map((a) => a.user_id));
      setAssigneePopoverOpen(false);
    }
  }, [isOpen, task]);

  useEffect(() => {
    if (!isOpen) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [isOpen, onClose]);

  useEffect(() => {
    if (!assigneePopoverOpen) return;
    const handleMouseDown = (e: MouseEvent) => {
      if (
        assigneePopoverRef.current &&
        !assigneePopoverRef.current.contains(e.target as Node)
      ) {
        setAssigneePopoverOpen(false);
      }
    };
    document.addEventListener('mousedown', handleMouseDown);
    return () => document.removeEventListener('mousedown', handleMouseDown);
  }, [assigneePopoverOpen]);

  type Overrides = Partial<{
    name: string;
    description: string;
    status: TaskStatus;
    priority: TaskPriority;
    dueDate: string;
    labelIndex: number;
  }>;

  const persist = useCallback(
    async (overrides: Overrides = {}) => {
      const finalName = (overrides.name ?? name).trim();
      if (!finalName) {
        setNameError('Task name is required');
        return;
      }
      setNameError(null);
      const finalLabelIndex = overrides.labelIndex ?? labelIndex;
      const selectedLabel = TASK_LABELS[finalLabelIndex];
      const finalDueDate = overrides.dueDate ?? dueDate;
      const input: UpdateTaskInput = {
        name: finalName,
        description: (overrides.description ?? description).trim(),
        status: overrides.status ?? status,
        priority: overrides.priority ?? priority,
        label: selectedLabel.name,
        label_color: selectedLabel.color,
      };
      if (finalDueDate) {
        input.due_date = new Date(finalDueDate).toISOString();
      }
      await onSubmit(input);
    },
    [name, description, status, priority, dueDate, labelIndex, onSubmit],
  );

  const toggleAssignee = useCallback(
    async (userId: string) => {
      if (!onSetAssignees) return;
      const next = assigneeIds.includes(userId)
        ? assigneeIds.filter((id) => id !== userId)
        : [...assigneeIds, userId];
      setAssigneeIds(next);
      await onSetAssignees(next);
    },
    [assigneeIds, onSetAssignees],
  );

  if (!isOpen) return null;

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) onClose();
  };

  const currentAssignees = assigneeIds
    .map((id) => assigneeOptions.find((o) => o.id === id))
    .filter((o): o is AssigneeOption => o !== undefined);

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-ink-900/40 px-4 py-12 backdrop-blur-[2px] md:items-center md:py-8"
      onClick={handleBackdropClick}
      role="dialog"
      aria-modal="true"
      aria-labelledby="edit-task-title"
    >
      <div className="relative my-auto w-full max-w-3xl rounded-2xl border border-ink-100 bg-cream-50 shadow-2xl">
        <header className="flex items-center justify-between gap-4 border-b border-ink-100 px-5 py-3">
          <span className="font-code text-[11px] text-ink-400">#{task.id}</span>
          <div className="flex items-center gap-3">
            {isSubmitting ? (
              <span className="font-code text-[11px] text-ink-400">Saving…</span>
            ) : null}
            <button
              type="button"
              onClick={onClose}
              aria-label="Close dialog"
              className="flex h-8 w-8 items-center justify-center rounded-md text-ink-400 transition-colors hover:bg-overlay-hover hover:text-ink-900"
            >
              <svg
                className="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </header>

        <div className="grid max-h-[calc(100vh-10rem)] grid-cols-1 overflow-y-auto md:grid-cols-[1fr_280px] md:divide-x md:divide-ink-100">
          <div className="space-y-4 px-6 py-6">
            <div>
              <input
                id="edit-task-title"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                onBlur={() => void persist()}
                placeholder="Untitled task"
                disabled={isSubmitting}
                className="w-full bg-transparent font-display text-2xl font-bold tracking-[-0.01em] text-ink-900 placeholder:text-ink-400 focus:outline-none"
              />
              {nameError ? (
                <span className="mt-1 block font-ui text-[11px] text-cl-danger-700">
                  {nameError}
                </span>
              ) : null}
            </div>

            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              onBlur={() => void persist()}
              placeholder="Add description…"
              disabled={isSubmitting}
              className="min-h-[200px] w-full resize-y bg-transparent font-body text-[14px] leading-relaxed text-ink-900 placeholder:text-ink-400 focus:outline-none"
            />
          </div>

          <aside className="space-y-5 px-5 py-6">
            {onSetAssignees ? (
              <PropertyRow label="Assignees">
                <div className="relative" ref={assigneePopoverRef}>
                  <button
                    type="button"
                    onClick={() => setAssigneePopoverOpen((v) => !v)}
                    className="flex w-full items-center gap-2 rounded-md border border-ink-100 bg-white px-2 py-1.5 text-left transition-colors hover:bg-overlay-hover focus:border-cl-blue-700 focus:outline-none focus:ring-1 focus:ring-cl-blue-700/30"
                  >
                    {currentAssignees.length === 0 ? (
                      <span className="font-ui text-[13px] text-ink-400">Assign…</span>
                    ) : (
                      <div className="flex flex-1 items-center gap-2">
                        <div className="flex -space-x-1">
                          {currentAssignees.slice(0, 3).map((a) => (
                            <span key={a.id} className="rounded-full ring-2 ring-white">
                              <Avatar size="xs" name={a.display_name} color="blue" />
                            </span>
                          ))}
                        </div>
                        <span className="font-ui text-[12px] text-ink-600">
                          {currentAssignees.length === 1
                            ? currentAssignees[0].display_name
                            : `${currentAssignees.length} assignees`}
                        </span>
                      </div>
                    )}
                  </button>
                  {assigneePopoverOpen ? (
                    <div className="absolute right-0 z-20 mt-1 max-h-64 w-full min-w-[240px] overflow-y-auto rounded-lg border border-ink-100 bg-white p-1 shadow-card-hover">
                      {assigneeOptions.length === 0 ? (
                        <div className="px-2 py-1.5 font-ui text-[12px] text-ink-400">
                          No project members
                        </div>
                      ) : (
                        assigneeOptions.map((opt) => {
                          const isSelected = assigneeIds.includes(opt.id);
                          return (
                            <button
                              key={opt.id}
                              type="button"
                              disabled={isSubmitting}
                              onClick={() => void toggleAssignee(opt.id)}
                              className={cn(
                                'flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-left transition-colors hover:bg-overlay-hover disabled:opacity-50',
                                isSelected ? 'bg-cl-blue-100' : '',
                              )}
                            >
                              <Avatar size="xs" name={opt.display_name} color="blue" />
                              <span className="flex-1 font-ui text-[13px] text-ink-900">
                                {opt.display_name}
                              </span>
                              {isSelected ? (
                                <svg
                                  className="h-4 w-4 text-cl-blue-700"
                                  fill="none"
                                  viewBox="0 0 24 24"
                                  stroke="currentColor"
                                  strokeWidth={2.5}
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M5 13l4 4L19 7"
                                  />
                                </svg>
                              ) : null}
                            </button>
                          );
                        })
                      )}
                    </div>
                  ) : null}
                </div>
              </PropertyRow>
            ) : null}

            <PropertyRow label="Status">
              <div className="flex flex-wrap gap-1.5">
                {STATUS_OPTIONS.map((opt) => {
                  const isActive = status === opt.value;
                  return (
                    <button
                      key={opt.value}
                      type="button"
                      disabled={isSubmitting}
                      onClick={async () => {
                        setStatus(opt.value);
                        await persist({ status: opt.value });
                      }}
                      className={cn(
                        'rounded-full border px-2.5 py-1 font-ui text-[11px] font-medium',
                        'transition-colors duration-fast disabled:cursor-not-allowed disabled:opacity-50',
                        isActive ? opt.selected : opt.unselected,
                      )}
                    >
                      {opt.label}
                    </button>
                  );
                })}
              </div>
            </PropertyRow>

            <PropertyRow label="Priority">
              <select
                value={priority}
                disabled={isSubmitting}
                onChange={async (e) => {
                  const next = e.target.value as TaskPriority;
                  setPriority(next);
                  await persist({ priority: next });
                }}
                className="w-full rounded-md border border-ink-100 bg-white px-2.5 py-1.5 font-ui text-[13px] text-ink-900 focus:border-cl-blue-700 focus:outline-none focus:ring-1 focus:ring-cl-blue-700/30 disabled:opacity-50"
              >
                {PRIORITY_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </PropertyRow>

            <PropertyRow label="Due date">
              <input
                type="date"
                value={dueDate}
                disabled={isSubmitting}
                onChange={(e) => {
                  const next = e.target.value;
                  setDueDate(next);
                  if (next) void persist({ dueDate: next });
                }}
                className="w-full rounded-md border border-ink-100 bg-white px-2.5 py-1.5 font-ui text-[13px] text-ink-900 focus:border-cl-blue-700 focus:outline-none focus:ring-1 focus:ring-cl-blue-700/30 disabled:opacity-50"
              />
            </PropertyRow>

            <PropertyRow label="Label">
              <select
                value={labelIndex}
                disabled={isSubmitting}
                onChange={async (e) => {
                  const next = Number(e.target.value);
                  setLabelIndex(next);
                  await persist({ labelIndex: next });
                }}
                className="w-full rounded-md border border-ink-100 bg-white px-2.5 py-1.5 font-ui text-[13px] text-ink-900 focus:border-cl-blue-700 focus:outline-none focus:ring-1 focus:ring-cl-blue-700/30 disabled:opacity-50"
              >
                {TASK_LABELS.map((label, idx) => (
                  <option key={label.name} value={idx}>
                    {label.name}
                  </option>
                ))}
              </select>
            </PropertyRow>
          </aside>
        </div>
      </div>
    </div>
  );
}

function PropertyRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1.5">
      <span className="font-ui text-[11px] font-medium text-ink-400">{label}</span>
      {children}
    </div>
  );
}
