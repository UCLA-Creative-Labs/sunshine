"use client";

import ProjectBoardContent from "@/components/ProjectBoardContent";

// TODO: get currentUserId from Supabase Auth session
// TODO: add route guard to verify user is a project member
export default function Page({ params }: { params: { projectId: string } }) {
  // TODO: replace with actual userId from auth session
  const currentUserId = "your-user-id-here";

  return (
    <>
      <section className="space-y-2">
        <h1 className="text-3xl md:text-4xl font-semibold tracking-tight">
          Board
        </h1>
      </section>
      <ProjectBoardContent 
        projectId={params.projectId}
        currentUserId={currentUserId}
      />
    </>
  );
}
