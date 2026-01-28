"use client";

import { use } from 'react';
import ProjectBoardContent from "@/components/ProjectBoardContent";
import { useAuth } from "@/lib/hooks/useAuth";

export default function Page({ params }: { params: Promise<{ projectId: string }> }) {
  const { projectId } = use(params);
  const { userId, isLoading, error } = useAuth();

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
    <>
      <section className="space-y-2">
        <h1 className="text-3xl md:text-4xl font-semibold tracking-tight">
          Board
        </h1>
      </section>
      <ProjectBoardContent 
        projectId={projectId}
        currentUserId={userId}
      />
    </>
  );
}
