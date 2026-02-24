"use client";

import MyProjectContent from "@/components/portal/project/MyProjectContent";
import { useAuth } from "@/lib/hooks/useAuth";
import { use } from 'react';

// TODO: add route guard to verify user is a project member
export default function Page({ params }: { params: Promise<{ projectId: string }> }) {
  const { userId, user, isLoading, error } = useAuth();
  const { projectId } = use(params);
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
      <MyProjectContent 
        projectId={projectId}
        currentUserId={userId}
      />
    </>
  );
}
