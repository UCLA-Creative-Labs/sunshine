"use client";

import ProjectBoardContent from "@/components/ProjectBoardContent";
import { useAuth } from "@/lib/hooks/useAuth";

// TODO: add route guard to verify user is a project member
export default function Page({ params }: { params: { projectId: string } }) {
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
        projectId={params.projectId}
        currentUserId={userId}
      />
    </>
  );
}
