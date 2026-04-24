"use client";

import React, { useState, useEffect } from 'react';
import { UpdateTaskInput, TASK_LABELS } from '@/lib/types/tasks';
import { TaskStatus, TaskPriority, TaskWithAssignments } from '@/lib/types/database';
import { Button, Input, Select, cn } from '@/components/portal/ui';

interface EditTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (input: UpdateTaskInput) => Promise<void>;
  task: TaskWithAssignments;
  isSubmitting?: boolean;
}

type StatusStyle = {
  label: string;
  unselected: string;
  selected: string;
};

const STATUS_OPTIONS: { value: TaskStatus; style: StatusStyle }[] = [
  {
    value: 'todo',
    style: {
      label: 'Todo',
      unselected: 'border-ink-200 text-ink-600 hover:bg-ink-100',
      selected: 'border-cl-blue-700 bg-cl-blue-100 text-cl-blue-700',
    },
  },
  {
    value: 'in_progress',
    style: {
      label: 'In Progress',
      unselected: 'border-ink-200 text-ink-600 hover:bg-ink-100',
      selected: 'border-cl-pink-700 bg-cl-pink-100 text-cl-pink-700',
    },
  },
  {
    value: 'in_review',
    style: {
      label: 'In Review',
      unselected: 'border-ink-200 text-ink-600 hover:bg-ink-100',
      selected: 'border-cl-lime-700 bg-cl-lime-100 text-cl-lime-700',
    },
  },
  {
    value: 'done',
    style: {
      label: 'Done',
      unselected: 'border-ink-200 text-ink-600 hover:bg-ink-100',
      selected: 'border-cl-mint-700 bg-cl-mint-100 text-cl-mint-700',
    },
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
  task,
  isSubmitting = false,
}: EditTaskModalProps) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState<TaskStatus>('todo');
  const [priority, setPriority] = useState<TaskPriority>('medium');
  const [dueDate, setDueDate] = useState('');
  const [labelIndex, setLabelIndex] = useState(0);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (isOpen && task) {
      setName(task.name || '');
      setDescription(task.description || '');
      setStatus(task.status);
      setPriority(task.priority);

      if (task.due_date) {
        const date = new Date(task.due_date);
        const formattedDate = date.toISOString().split('T')[0];
        setDueDate(formattedDate);
      } else {
        setDueDate('');
      }

      const foundLabelIndex = TASK_LABELS.findIndex((l) => l.name === task.label);
      setLabelIndex(foundLabelIndex >= 0 ? foundLabelIndex : 0);
      setErrors({});
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

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};
    if (!name.trim()) newErrors.name = 'Task name is required';
    if (!description.trim()) newErrors.description = 'Description is required';
    if (!dueDate) newErrors.dueDate = 'Due date is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    const selectedLabel = TASK_LABELS[labelIndex];
    const input: UpdateTaskInput = {
      name: name.trim(),
      description: description.trim(),
      status,
      priority,
      due_date: new Date(dueDate).toISOString(),
      label: selectedLabel.name,
      label_color: selectedLabel.color,
    };
    await onSubmit(input);
  };

  if (!isOpen) return null;

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-ink-900/40 backdrop-blur-[2px] px-4 py-8 overflow-y-auto"
      onClick={handleBackdropClick}
      role="dialog"
      aria-modal="true"
      aria-labelledby="edit-task-title"
    >
      <div className="relative my-auto w-full max-w-lg rounded-2xl border border-ink-200 bg-cream-50 shadow-2xl">
        <header className="flex items-start justify-between gap-4 border-b border-ink-100 px-6 py-5">
          <div className="flex flex-col gap-1">
            <span className="font-code text-[11px] uppercase tracking-[0.12em] text-ink-400">
              Editing task
            </span>
            <h2
              id="edit-task-title"
              className="font-display text-2xl font-bold uppercase tracking-[-0.01em] text-ink-900"
            >
              Edit task
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close dialog"
            className="flex h-9 w-9 items-center justify-center rounded-full border border-ink-200 bg-white text-ink-600 transition-colors hover:border-ink-900 hover:bg-ink-50 hover:text-ink-900"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </header>

        <div className="max-h-[calc(100vh-12rem)] overflow-y-auto px-6 py-6">
          <form onSubmit={handleSubmit} className="space-y-5">
            <Input
              label="Task name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="What needs doing?"
              error={errors.name}
              disabled={isSubmitting}
            />

            <div className="flex flex-col gap-2">
              <label className="font-ui font-bold text-[13px] text-ink-900">Description</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className={cn(
                  'w-full rounded-md border bg-white px-3.5 py-2.5 font-body text-sm text-ink-900',
                  'placeholder:text-ink-400 transition-colors duration-fast',
                  'focus:outline-none focus:ring-4',
                  'min-h-[88px] resize-y',
                  errors.description
                    ? 'border-cl-danger-700 focus:border-cl-danger-700 focus:ring-cl-pink-100'
                    : 'border-ink-200 focus:border-cl-pink-700 focus:ring-cl-pink-100',
                )}
                placeholder="Scope, acceptance criteria, links…"
                disabled={isSubmitting}
              />
              {errors.description ? (
                <span className="font-ui text-[11px] font-semibold tracking-wide text-cl-danger-700">
                  {errors.description}
                </span>
              ) : null}
            </div>

            <div className="flex flex-col gap-2">
              <label className="font-ui font-bold text-[13px] text-ink-900">Status</label>
              <div className="flex flex-wrap gap-2">
                {STATUS_OPTIONS.map((opt) => {
                  const isActive = status === opt.value;
                  return (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() => setStatus(opt.value)}
                      disabled={isSubmitting}
                      className={cn(
                        'rounded-full border px-3.5 py-1.5 font-display text-[12px] font-bold uppercase tracking-[0.06em]',
                        'transition-colors duration-fast disabled:opacity-50 disabled:cursor-not-allowed',
                        isActive ? opt.style.selected : opt.style.unselected,
                      )}
                    >
                      {opt.style.label}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <Select
                label="Priority"
                value={priority}
                onChange={(e) => setPriority(e.target.value as TaskPriority)}
                disabled={isSubmitting}
              >
                {PRIORITY_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </Select>

              <Input
                label="Due date"
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                error={errors.dueDate}
                disabled={isSubmitting}
              />
            </div>

            <Select
              label="Label"
              value={labelIndex}
              onChange={(e) => setLabelIndex(Number(e.target.value))}
              disabled={isSubmitting}
            >
              {TASK_LABELS.map((label, idx) => (
                <option key={label.name} value={idx}>
                  {label.name}
                </option>
              ))}
            </Select>

            <div className="flex justify-end gap-3 pt-2">
              <Button variant="ghost" size="sm" onClick={onClose} disabled={isSubmitting}>
                Cancel
              </Button>
              <Button type="submit" variant="primary" size="sm" disabled={isSubmitting}>
                {isSubmitting ? 'Saving…' : 'Save changes'}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
