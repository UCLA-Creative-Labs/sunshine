"use client";

import React, { useEffect } from 'react';
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

export function AddTaskModal({
  isOpen,
  onClose,
  onSubmit,
  projectId,
  projectMembers,
  isSubmitting = false,
}: AddTaskModalProps) {
  useEffect(() => {
    if (!isOpen) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [isOpen, onClose]);

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
      aria-labelledby="add-task-title"
    >
      <div className="relative my-auto w-full max-w-lg rounded-2xl border border-ink-200 bg-cream-50 shadow-2xl">
        <header className="flex items-start justify-between gap-4 border-b border-ink-100 px-6 py-5">
          <div className="flex flex-col gap-1">
            <span className="font-code text-[11px] uppercase tracking-[0.12em] text-ink-400">
              New task
            </span>
            <h2
              id="add-task-title"
              className="font-display text-2xl font-bold uppercase tracking-[-0.01em] text-ink-900"
            >
              Create task
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close dialog"
            className="flex h-9 w-9 items-center justify-center rounded-full border border-ink-200 bg-white text-ink-600 transition-colors hover:border-ink-900 hover:bg-cream-100 hover:text-ink-900"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </header>

        <div className="max-h-[calc(100vh-12rem)] overflow-y-auto px-6 py-6">
          <TaskForm
            projectId={projectId}
            projectMembers={projectMembers}
            onSubmit={onSubmit}
            onCancel={onClose}
            isSubmitting={isSubmitting}
          />
        </div>
      </div>
    </div>
  );
}
