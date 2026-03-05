"use client";

import React, { useState } from 'react';
import {
  CreateTaskAssignmentContext,
  CreateTaskInput,
  TASK_LABELS,
} from '@/lib/types/tasks';
import { TaskStatus, TaskPriority } from '@/lib/types/database';

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

const STATUS_OPTIONS: { value: TaskStatus; label: string }[] = [
  { value: 'todo', label: 'Todo' },
  { value: 'in_progress', label: 'In Progress' },
  { value: 'in_review', label: 'In Review' },
  { value: 'done', label: 'Done' },
];

const PRIORITY_OPTIONS: { value: TaskPriority; label: string }[] = [
  { value: 'low', label: 'Low' },
  { value: 'medium', label: 'Medium' },
  { value: 'high', label: 'High' },
  { value: 'urgent', label: 'Urgent' },
];

/**
 * task creation form
 */
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
      .filter((member) => selectedAssignees.includes(member.id))
      .map((member) => member.display_name);

    await onSubmit(input, {
      assigneeIds: selectedAssignees,
      assigneeDisplayNames: selectedAssigneeNames,
      assignmentNote: assignmentNote.trim() || undefined,
    });
  };

  const toggleAssignee = (userId: string) => {
    setSelectedAssignees(prev =>
      prev.includes(userId)
        ? prev.filter(id => id !== userId)
        : [...prev, userId]
    );
  };

  const inputClass = "w-full rounded-lg border border-[#D4D7E5] px-4 py-2 text-sm focus:border-[#3F86FF] focus:outline-none";
  const labelClass = "mb-1 block text-sm font-medium text-black/70";
  const errorClass = "mt-1 text-xs text-red-500";

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className={labelClass}>Task Name *</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className={inputClass}
          placeholder="Enter task name"
        />
        {errors.name && <p className={errorClass}>{errors.name}</p>}
      </div>

      <div>
        <label className={labelClass}>Description *</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className={`${inputClass} min-h-[80px] resize-none`}
          placeholder="Describe the task"
        />
        {errors.description && <p className={errorClass}>{errors.description}</p>}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className={labelClass}>Status *</label>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value as TaskStatus)}
            className={inputClass}
          >
            {STATUS_OPTIONS.map(opt => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        </div>
        <div>
          <label className={labelClass}>Priority *</label>
          <select
            value={priority}
            onChange={(e) => setPriority(e.target.value as TaskPriority)}
            className={inputClass}
          >
            {PRIORITY_OPTIONS.map(opt => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className={labelClass}>Due Date *</label>
          <input
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            className={inputClass}
          />
          {errors.dueDate && <p className={errorClass}>{errors.dueDate}</p>}
        </div>
        <div>
          <label className={labelClass}>Label *</label>
          <select
            value={labelIndex}
            onChange={(e) => setLabelIndex(Number(e.target.value))}
            className={inputClass}
          >
            {TASK_LABELS.map((label, idx) => (
              <option key={label.name} value={idx}>{label.name}</option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label className={labelClass}>Assignees *</label>
        <div className="flex flex-wrap gap-2 rounded-lg border border-[#D4D7E5] p-3">
          {projectMembers.map(member => (
            <button
              key={member.id}
              type="button"
              onClick={() => toggleAssignee(member.id)}
              className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${
                selectedAssignees.includes(member.id)
                  ? 'bg-[#3F86FF] text-white'
                  : 'bg-[#E5E7EB] text-black/70 hover:bg-[#D4D7E5]'
              }`}
            >
              {member.display_name}
            </button>
          ))}
          {projectMembers.length === 0 && (
            <p className="text-sm text-black/50">No project members found</p>
          )}
        </div>
        {errors.assignees && <p className={errorClass}>{errors.assignees}</p>}
      </div>

      <div>
        <label className={labelClass}>Assignment Note (Optional)</label>
        <textarea
          value={assignmentNote}
          onChange={(e) => setAssignmentNote(e.target.value)}
          className={`${inputClass} min-h-[72px] resize-none`}
          placeholder="Add context for assignees (this appears in recent activity)"
        />
      </div>

      <div className="flex justify-end gap-3 pt-4">
        <button
          type="button"
          onClick={onCancel}
          className="rounded-lg border border-[#D4D7E5] px-4 py-2 text-sm font-medium text-black/70 hover:bg-gray-50"
          disabled={isSubmitting}
        >
          Cancel
        </button>
        <button
          type="submit"
          className="rounded-lg bg-[#3F86FF] px-4 py-2 text-sm font-medium text-white hover:bg-[#346edd] disabled:opacity-50"
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Creating...' : 'Create Task'}
        </button>
      </div>
    </form>
  );
}
