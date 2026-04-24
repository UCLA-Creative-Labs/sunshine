"use client";

import React, { useState } from 'react';
import {
  CreateTaskAssignmentContext,
  CreateTaskInput,
  TASK_LABELS,
} from '@/lib/types/tasks';
import { TaskStatus, TaskPriority } from '@/lib/types/database';
import { Avatar, Button, Input, Select, cn, pickAvatarColor } from '@/components/portal/ui';

interface TaskFormProps {
  projectId: string;
  projectMembers: { id: string; display_name: string }[];
  onSubmit: (
    input: CreateTaskInput,
    assignmentContext: CreateTaskAssignmentContext,
  ) => Promise<void>;
  onCancel: () => void;
  isSubmitting: boolean;
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

export function TaskForm({
  projectId,
  projectMembers,
  onSubmit,
  onCancel,
  isSubmitting,
}: TaskFormProps) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState<TaskStatus>('todo');
  const [priority, setPriority] = useState<TaskPriority>('medium');
  const [dueDate, setDueDate] = useState('');
  const [labelIndex, setLabelIndex] = useState(0);
  const [selectedAssignees, setSelectedAssignees] = useState<string[]>([]);
  const [assignmentNote, setAssignmentNote] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};
    if (!name.trim()) newErrors.name = 'Task name is required';
    if (!description.trim()) newErrors.description = 'Description is required';
    if (!dueDate) newErrors.dueDate = 'Due date is required';
    if (selectedAssignees.length === 0) newErrors.assignees = 'At least one assignee is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    const selectedLabel = TASK_LABELS[labelIndex];
    const input: CreateTaskInput = {
      project_id: projectId,
      name: name.trim(),
      description: description.trim(),
      status,
      priority,
      due_date: new Date(dueDate).toISOString(),
      label: selectedLabel.name,
      label_color: selectedLabel.color,
    };

    const selectedAssigneeNames = projectMembers
      .filter((m) => selectedAssignees.includes(m.id))
      .map((m) => m.display_name);

    await onSubmit(input, {
      assigneeIds: selectedAssignees,
      assigneeDisplayNames: selectedAssigneeNames,
      assignmentNote: assignmentNote.trim() || undefined,
    });
  };

  const toggleAssignee = (userId: string) => {
    setSelectedAssignees((prev) =>
      prev.includes(userId) ? prev.filter((id) => id !== userId) : [...prev, userId],
    );
  };

  return (
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

      <div className="flex flex-col gap-2">
        <label className="font-ui font-bold text-[13px] text-ink-900">
          Assignees{' '}
          {selectedAssignees.length > 0 ? (
            <span className="ml-1 font-code text-[11px] font-semibold text-ink-400">
              ({selectedAssignees.length})
            </span>
          ) : null}
        </label>
        <div className="flex flex-wrap gap-2 rounded-md border border-ink-200 bg-white p-2.5">
          {projectMembers.length === 0 ? (
            <p className="font-code text-[11px] uppercase tracking-[0.08em] text-ink-400">
              no project members found
            </p>
          ) : (
            projectMembers.map((member) => {
              const isSelected = selectedAssignees.includes(member.id);
              return (
                <button
                  key={member.id}
                  type="button"
                  onClick={() => toggleAssignee(member.id)}
                  disabled={isSubmitting}
                  className={cn(
                    'inline-flex items-center gap-2 rounded-full border pr-3 pl-1 py-1',
                    'transition-colors duration-fast disabled:opacity-50',
                    isSelected
                      ? 'border-cl-blue-700 bg-cl-blue-100 text-cl-blue-700'
                      : 'border-ink-200 text-ink-600 hover:bg-ink-100',
                  )}
                >
                  <Avatar
                    name={member.display_name}
                    color={pickAvatarColor(member.display_name)}
                    size="xs"
                  />
                  <span className="font-ui text-[13px] font-semibold">{member.display_name}</span>
                </button>
              );
            })
          )}
        </div>
        {errors.assignees ? (
          <span className="font-ui text-[11px] font-semibold tracking-wide text-cl-danger-700">
            {errors.assignees}
          </span>
        ) : null}
      </div>

      <div className="flex flex-col gap-2">
        <label className="font-ui font-bold text-[13px] text-ink-900">
          Assignment note <span className="ml-1 font-normal text-ink-400">(optional)</span>
        </label>
        <textarea
          value={assignmentNote}
          onChange={(e) => setAssignmentNote(e.target.value)}
          className={cn(
            'w-full rounded-md border border-ink-200 bg-white px-3.5 py-2.5 font-body text-sm text-ink-900',
            'placeholder:text-ink-400 transition-colors duration-fast',
            'focus:outline-none focus:ring-4 focus:border-cl-pink-700 focus:ring-cl-pink-100',
            'min-h-[72px] resize-y',
          )}
          placeholder="Context for assignees (shows in activity feed)"
          disabled={isSubmitting}
        />
      </div>

      <div className="flex justify-end gap-3 pt-2">
        <Button variant="ghost" size="sm" onClick={onCancel} disabled={isSubmitting}>
          Cancel
        </Button>
        <Button type="submit" variant="primary" size="sm" disabled={isSubmitting}>
          {isSubmitting ? 'Creating…' : 'Create task'}
        </Button>
      </div>
    </form>
  );
}
