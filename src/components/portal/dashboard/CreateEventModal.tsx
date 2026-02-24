"use client";

import React from 'react';
import { EventForm } from './EventForm';
import { ProjectEvent } from '@/types/events';

interface CreateEventModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (eventData: Omit<ProjectEvent, 'id' | 'created_at' | 'updated_at'>) => Promise<void>;
  userId: string;
  isSubmitting?: boolean;
}

/**
 * Modal for creating a new event
 */
export function CreateEventModal({
  isOpen,
  onClose,
  onSubmit,
  userId,
  isSubmitting = false,
}: CreateEventModalProps) {
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
      <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl max-h-[90vh] overflow-y-auto">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-xl font-semibold">Plan Event</h2>
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

        <EventForm
          userId={userId}
          onSubmit={onSubmit}
          onCancel={onClose}
          isSubmitting={isSubmitting}
        />
      </div>
    </div>
  );
}
