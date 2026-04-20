"use client";

import React from 'react';
import { TaskForm } from './TaskForm';
import {
  CreateTaskAssignmentContext,
  CreateTaskInput,
} from '@/lib/types/tasks';

interface AddTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (
    input: CreateTaskInput,
    assignmentContext: CreateTaskAssignmentContext,
  ) => Promise<void>;
  projectId: string;
  projectMembers: { id: string; display_name: string }[];
  isSubmitting?: boolean;
}

/**
 * dialog for creating a new task
 */
export function AddTaskModal({
  isOpen,
  onClose,
  onSubmit,
  projectId,
  projectMembers,
  isSubmitting = false,
}: AddTaskModalProps) {
  if (!isOpen) return null;

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
      onClick={handleBackdropClick}
    >
      <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-xl font-semibold">Create New Task</h2>
          <button
            onClick={onClose}
            className="text-black/50 hover:text-black"
            aria-label="Close modal"
          >
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <TaskForm
          projectId={projectId}
          projectMembers={projectMembers}
          onSubmit={onSubmit}
          onCancel={onClose}
          isSubmitting={isSubmitting}
        />
      </div>
    </div>
  );
}
