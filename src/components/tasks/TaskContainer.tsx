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
 * Container component that handles task actions (edit/delete)
 * and provides the actions menu to child components
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
    // TODO: Implement edit modal
    alert('Edit functionality coming soon!');
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
