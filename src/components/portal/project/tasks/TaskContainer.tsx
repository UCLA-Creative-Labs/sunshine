"use client";

import { ReactNode } from 'react';
import { useTaskActions } from '@/lib/hooks/useTaskActions';
import { TaskActionsMenu } from './TaskActionsMenu';

interface TaskContainerProps {
  taskId: string;
  canEdit: boolean;
  onRefresh: () => void;
  children: (props: { actionsMenu: ReactNode }) => ReactNode;
}

/**
 * component that handles task actions (edit/delete)
 */
export function TaskContainer({ taskId, canEdit, onRefresh, children }: TaskContainerProps) {
  const { deleteTaskAction } = useTaskActions();

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this task?')) return;
    
    const success = await deleteTaskAction(taskId);
    if (success) {
      onRefresh();
    }
  };

  const handleEdit = () => {
    // Edit functionality is now handled in parent components
    console.warn('Edit should be handled in parent component');
  };

  const actionsMenu = (
    <TaskActionsMenu 
      onEdit={handleEdit}
      onDelete={handleDelete}
      canEdit={canEdit}
    />
  );

  return <>{children({ actionsMenu })}</>;
}
