"use client";

import { ReactNode } from 'react';
import { useTaskActions } from '@/lib/hooks/useTaskActions';
import { TaskActionsMenu } from './TaskActionsMenu';
import { UpdateTaskInput } from '@/lib/types/tasks';

interface TaskContainerProps {
  taskId: string;
  canEdit: boolean;
  isCompleted?: boolean;
  onRefresh: () => void;
  children: (props: { actionsMenu: ReactNode }) => ReactNode;
}

/**
 * component that handles task actions (edit/delete)
 */
export function TaskContainer({ taskId, canEdit, isCompleted = false, onRefresh, children }: TaskContainerProps) {
  const { updateTaskAction, deleteTaskAction } = useTaskActions();

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

  const handleMarkComplete = async () => {
    const input: UpdateTaskInput = {
      status: 'done',
    };
    
    const success = await updateTaskAction(taskId, input);
    if (success) {
      onRefresh();
    }
  };

  const actionsMenu = (
    <TaskActionsMenu 
      onEdit={handleEdit}
      onMarkComplete={handleMarkComplete}
      onDelete={handleDelete}
      canEdit={canEdit}
      isCompleted={isCompleted}
    />
  );

  return <>{children({ actionsMenu })}</>;
}
