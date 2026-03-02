'use client';

import { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { getAllProjects } from '@/lib/supabase/projectService';
import { Project } from '@/types/project';

export default function InternalProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    getAllProjects().then((data) => {
      setProjects(data);
      setLoading(false);
    });
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold text-gray-900">Projects</h1>

      <div className="rounded-2xl border border-[#D4D7E5] bg-white shadow-lg overflow-hidden">
        {projects.length === 0 ? (
          <p className="text-gray-500 text-sm px-4 py-6">No projects found</p>
        ) : (
          projects.map((project, index) => {
            const isActive = pathname.startsWith(
              `/portal/internal/projects/${project.id}`
            );
            const isLast = index === projects.length - 1;

            return (
              <div
                key={project.id}
                onClick={() =>
                  router.push(`/portal/internal/projects/${project.id}`)
                }
                className={[
                  'flex items-center justify-between px-4 py-3',
                  !isLast ? 'border-b border-[#D4D7E5]' : '',
                  isActive
                    ? 'bg-[rgba(108,162,255,0.25)] text-[#3F86FF]'
                    : 'hover:bg-gray-50 cursor-pointer',
                ]
                  .filter(Boolean)
                  .join(' ')}
              >
                <span className="font-semibold">{project.projectName}</span>
                <span className="text-sm text-gray-500">
                  {project.quarter} {project.year}
                </span>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
