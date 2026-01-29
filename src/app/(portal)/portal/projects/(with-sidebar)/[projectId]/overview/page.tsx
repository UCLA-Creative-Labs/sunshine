"use client";

import MyProjectContent from "@/components/portal/project/MyProjectContent";
import { useAuth } from "@/lib/hooks/useAuth";
import { use } from 'react';
import { useState, useEffect } from 'react';
import { getProjectById } from '@/lib/supabase/projectService';

// TODO: add route guard to verify user is a project member
export default function Page({ params }: { params: Promise<{ projectId: string }> }) {
  const { userId, isLoading, error } = useAuth();
  const { projectId } = use(params);
  const [project, setProject] = useState<any>(null);
  const [projectLoading, setProjectLoading] = useState(true);

  useEffect(() => {
    async function fetchProject() {
      try {
        setProjectLoading(true);
        const data = await getProjectById(projectId);
        setProject(data);
      } catch (err) {
        console.error('Failed to load project:', err);
      } finally {
        setProjectLoading(false);
      }
    }
    fetchProject();
  }, [projectId]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <p className="text-sm text-black/50">Loading...</p>
      </div>
    );
  }
   // TODO: use an actual guard to protect unautenticated users from accessing page
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
          {projectLoading ? "Loading..." : (project?.projectName || "My Project")}
        </h1>
      </section>
      <MyProjectContent 
        projectId={projectId}
        currentUserId={userId}
      />
    </>
  );
}
