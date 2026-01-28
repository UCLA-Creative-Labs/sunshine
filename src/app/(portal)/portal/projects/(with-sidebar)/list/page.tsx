"use client";

import ProjectListContent from "@/components/ProjectListContent";

// TODO: convert to dynamic route /portal/projects/[projectId]/list
// TODO: implement route guard to verify user is a project member
// TODO: get currentUserId from Supabase Auth session
export default function Page() {
  // replace with actual projectId from route params and userId from auth session
  const projectId = "your-project-id-here";
  const currentUserId = "your-user-id-here";

  return (
    <>
      <section className="space-y-2">
        <h1 className="text-3xl md:text-4xl font-semibold tracking-tight">
          List
        </h1>
      </section>
      <ProjectListContent 
        projectId={projectId}
        currentUserId={currentUserId}
      />
    </>
  );
}
