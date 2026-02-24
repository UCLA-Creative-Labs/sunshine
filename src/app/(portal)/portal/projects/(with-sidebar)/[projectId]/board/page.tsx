"use client";

import ProjectBoardContent from "@/components/portal/project/ProjectBoardContent";
import { useAuth } from "@/lib/hooks/useAuth";
import { use } from 'react';

export default function Page({ params }: { params: Promise<{ projectId: string }> }) {
  const { userId, isLoading, error } = useAuth();
  const { projectId } = use(params);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <p className="text-sm text-black/50">Loading...</p>
      </div>
    );
  }

  if (error || !userId) {
    return (
      <div className="flex items-center justify-center py-12">
        <p className="text-sm text-red-500">Please sign in to view this page</p>
      </div>
    );
  }

  return (
    <ProjectBoardContent
      projectId={projectId}
      currentUserId={userId}
    />
  );
}
