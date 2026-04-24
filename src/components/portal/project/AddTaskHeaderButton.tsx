'use client';

import React from 'react';
import { Button } from '@/components/portal/ui';
import { useAuth } from '@/lib/hooks/useAuth';
import { useUserRole } from '@/lib/hooks/useUserRole';

export const ADD_TASK_EVENT = 'portal:openAddTask';

interface AddTaskHeaderButtonProps {
  projectId: string;
}

export function AddTaskHeaderButton({ projectId }: AddTaskHeaderButtonProps) {
  const { userId } = useAuth();
  const { canCreateTasks } = useUserRole(projectId, userId ?? '');

  if (!userId || !canCreateTasks) return null;

  const handleClick = () => {
    if (typeof window === 'undefined') return;
    window.dispatchEvent(new CustomEvent(ADD_TASK_EVENT));
  };

  return (
    <Button
      variant="primary"
      size="sm"
      onClick={handleClick}
      leadingIcon={<span aria-hidden className="text-base leading-none">+</span>}
    >
      Add Task
    </Button>
  );
}
