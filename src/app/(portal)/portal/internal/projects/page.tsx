'use client';

import { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { getAllProjects } from '@/lib/supabase/projectService';
import { Project } from '@/types/project';

function quarterSortKey(quarter: string, year: string): number {
  const q = parseInt(quarter.replace(/\D/g, ''), 10) || 0;
  return parseInt(year, 10) * 10 + q;
}

export default function InternalProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedQuarter, setSelectedQuarter] = useState<string>('');
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    getAllProjects()
      .then((data) => {
        setProjects(data);
        if (data.length > 0) {
          const sorted = [...data].sort(
            (a, b) =>
              quarterSortKey(b.quarter, b.year) -
              quarterSortKey(a.quarter, a.year)
          );
          setSelectedQuarter(`${sorted[0].quarter} ${sorted[0].year}`);
        }
      })
      .catch((err) => console.error('Failed to load projects:', err))
      .finally(() => setLoading(false));
  }, []);

  const quarters = Array.from(
    new Set(projects.map((p) => `${p.quarter} ${p.year}`))
  ).sort((a, b) => {
    const [aq, ay] = a.split(' ');
    const [bq, by] = b.split(' ');
    return quarterSortKey(bq, by) - quarterSortKey(aq, ay);
  });

  const filtered = selectedQuarter
    ? projects.filter((p) => `${p.quarter} ${p.year}` === selectedQuarter)
    : projects;

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Projects</h1>
        {quarters.length > 1 && (
          <select
            value={selectedQuarter}
            onChange={(e) => setSelectedQuarter(e.target.value)}
            className="text-sm border border-[#D4D7E5] rounded-lg px-3 py-1.5 bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-300"
          >
            {quarters.map((q) => (
              <option key={q} value={q}>
                {q}
              </option>
            ))}
          </select>
        )}
      </div>

      <div className="rounded-2xl border border-[#D4D7E5] bg-white shadow-lg overflow-hidden">
        {filtered.length === 0 ? (
          <p className="text-gray-500 text-sm px-4 py-6">No projects found</p>
        ) : (
          filtered.map((project, index) => {
            const isActive = pathname.startsWith(
              `/portal/internal/projects/${project.id}`
            );
            const isLast = index === filtered.length - 1;

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
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
