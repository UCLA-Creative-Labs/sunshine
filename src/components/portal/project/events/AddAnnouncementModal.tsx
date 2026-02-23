"use client";

import React from 'react';
import { AnnouncementForm } from './AnnouncementForm';
import { CreateAnnouncementInput } from '@/types/events';

interface AddAnnouncementModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (input: CreateAnnouncementInput) => Promise<void>;
  projectId: string;
  isSubmitting?: boolean;
}

export function AddAnnouncementModal({
  isOpen,
  onClose,
  onSubmit,
  projectId,
  isSubmitting = false,
}: AddAnnouncementModalProps) {
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
      <div className="w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-2xl bg-white p-6 shadow-xl">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-xl font-semibold">Create Announcement</h2>
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

        <AnnouncementForm
          projectId={projectId}
          onSubmit={onSubmit}
          onCancel={onClose}
          isSubmitting={isSubmitting}
        />
      </div>
    </div>
  );
}
