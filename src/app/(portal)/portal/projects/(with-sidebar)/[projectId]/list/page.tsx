"use client";

import ProjectListContent from "@/components/ProjectListContent";

// TODO: get currentUserId from Supabase Auth session
// TODO: add route guard to verify user is a project member
export default function Page({ params }: { params: { projectId: string } }) {
  // TODO: replace with actual userId from auth session
  const currentUserId = "your-user-id-here";

  return (
    <>
      <section className="space-y-2">
        <h1 className="text-3xl md:text-4xl font-semibold tracking-tight">
          List
        </h1>
      </section>
      <ProjectListContent 
        projectId={params.projectId}
        currentUserId={currentUserId}
      />
    </>
  );
}
