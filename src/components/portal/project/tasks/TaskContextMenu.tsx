"use client";

import { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';

interface TaskContextMenuProps {
  x: number;
  y: number;
  canEdit: boolean;
  isCompleted: boolean;
  onEdit: () => void;
  onMarkComplete: () => void;
  onDelete: () => void;
  onClose: () => void;
}

const MENU_WIDTH = 176;
const MENU_PAD = 8;

export function TaskContextMenu({
  x,
  y,
  canEdit,
  isCompleted,
  onEdit,
  onMarkComplete,
  onDelete,
  onClose,
}: TaskContextMenuProps) {
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleMouseDown = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        onClose();
      }
    };
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    const handleScroll = () => onClose();
    document.addEventListener('mousedown', handleMouseDown);
    document.addEventListener('keydown', handleKey);
    window.addEventListener('scroll', handleScroll, true);
    window.addEventListener('resize', onClose);
    return () => {
      document.removeEventListener('mousedown', handleMouseDown);
      document.removeEventListener('keydown', handleKey);
      window.removeEventListener('scroll', handleScroll, true);
      window.removeEventListener('resize', onClose);
    };
  }, [onClose]);

  if (typeof document === 'undefined') return null;

  const maxLeft = window.innerWidth - MENU_WIDTH - MENU_PAD;
  const left = Math.min(Math.max(MENU_PAD, x), maxLeft);
  const top = y + MENU_PAD;

  return createPortal(
    <div
      ref={menuRef}
      role="menu"
      aria-label="Task actions"
      className="fixed z-50 w-44 overflow-hidden rounded-lg border border-ink-100 bg-white py-1 shadow-card-hover"
      style={{ top: `${top}px`, left: `${left}px` }}
    >
      <button
        type="button"
        role="menuitem"
        disabled={!canEdit}
        onClick={() => {
          onClose();
          onEdit();
        }}
        className="block w-full px-3 py-1.5 text-left font-ui text-[13px] text-ink-900 transition-colors hover:bg-overlay-hover disabled:cursor-not-allowed disabled:text-ink-400"
      >
        Open
      </button>
      {!isCompleted ? (
        <button
          type="button"
          role="menuitem"
          disabled={!canEdit}
          onClick={() => {
            onClose();
            onMarkComplete();
          }}
          className="block w-full px-3 py-1.5 text-left font-ui text-[13px] text-cl-mint-700 transition-colors hover:bg-overlay-hover disabled:cursor-not-allowed disabled:text-ink-400"
        >
          Mark complete
        </button>
      ) : null}
      <div className="my-1 h-px bg-ink-100" aria-hidden />
      <button
        type="button"
        role="menuitem"
        disabled={!canEdit}
        onClick={() => {
          onClose();
          onDelete();
        }}
        className="block w-full px-3 py-1.5 text-left font-ui text-[13px] text-cl-danger-700 transition-colors hover:bg-overlay-hover disabled:cursor-not-allowed disabled:text-ink-400"
      >
        Delete
      </button>
    </div>,
    document.body,
  );
}
