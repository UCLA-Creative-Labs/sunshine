"use client";

import { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';

interface TaskActionsMenuProps {
  onEdit: () => void;
  onMarkComplete: () => void;
  onDelete: () => void;
  onPushToGithub?: () => void;
  canEdit: boolean;
  isCompleted?: boolean;
  githubUrl?: string | null;
}

export function TaskActionsMenu({ onEdit, onMarkComplete, onDelete, onPushToGithub, canEdit, isCompleted = false, githubUrl }: TaskActionsMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [menuPosition, setMenuPosition] = useState({ top: 0, left: 0 });
  const buttonRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node) &&
        buttonRef.current && !buttonRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isOpen]);

  const handleToggle = (e: React.MouseEvent) => {
    e.stopPropagation();

    if (!isOpen && buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      setMenuPosition({
        top: rect.bottom + 4,
        left: rect.right - 160,
      });
    }

    setIsOpen(!isOpen);
  };

  if (!canEdit) return null;

  return (
    <>
      <button
        ref={buttonRef}
        onClick={handleToggle}
        className="p-1 rounded hover:bg-gray-100 transition-colors"
        aria-label="Task actions"
      >
        <svg className="h-4 w-4 text-gray-600" fill="currentColor" viewBox="0 0 16 16">
          <circle cx="8" cy="2" r="1.5" />
          <circle cx="8" cy="8" r="1.5" />
          <circle cx="8" cy="14" r="1.5" />
        </svg>
      </button>

      {isOpen && createPortal(
        <div
          ref={menuRef}
          className="fixed z-50 w-40 rounded-lg bg-white shadow-lg border border-gray-200 py-1"
          style={{
            top: `${menuPosition.top}px`,
            left: `${menuPosition.left}px`,
          }}
        >
          <button
            onClick={(e) => {
              e.stopPropagation();
              setIsOpen(false);
              onEdit();
            }}
            className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 transition-colors"
          >
            Edit
          </button>
          {!isCompleted && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                setIsOpen(false);
                onMarkComplete();
              }}
              className="w-full px-4 py-2 text-left text-sm text-green-600 hover:bg-green-50 transition-colors"
            >
              Mark Complete
            </button>
          )}
          {githubUrl ? (
            <a
              href={githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full block px-4 py-2 text-left text-sm text-black hover:bg-gray-100 transition-colors"
              onClick={(e) => {
                e.stopPropagation();
                setIsOpen(false);
              }}
            >
              View in GitHub
            </a>
          ) : (
            onPushToGithub && !isCompleted && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setIsOpen(false);
                  onPushToGithub();
                }}
                className="w-full px-4 py-2 text-left text-sm text-black hover:bg-gray-100 transition-colors"
              >
                Push to GitHub
              </button>
            )
          )}
          <button
            onClick={(e) => {
              e.stopPropagation();
              setIsOpen(false);
              onDelete();
            }}
            className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 transition-colors"
          >
            Delete
          </button>
        </div>,
        document.body
      )}
    </>
  );
}
