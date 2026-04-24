import {
  ActivityPanel,
  ProjectHeaderBand,
  Sidebar,
  type ProjectHeaderLead,
  type SidebarItem,
} from '@/components/portal/ui';
import { pickAvatarColor } from '@/components/portal/ui';
import { AddTaskHeaderButton } from '@/components/portal/project/AddTaskHeaderButton';
import { RxHome, RxDashboard, RxRows, RxPerson, RxGear } from 'react-icons/rx';
import { createClient } from '@/lib/supabase/server';

interface ProjectLayoutProps {
  children: React.ReactNode;
  params: Promise<{ projectId: string }>;
}

type ProjectNavEntry = {
  id: string;
  label: string;
  path: string;
  Icon: React.ComponentType<{ size?: number; className?: string }>;
};

const PROJECT_NAV: ProjectNavEntry[] = [
  { id: 'overview', label: 'Overview', path: 'overview', Icon: RxHome },
  { id: 'board',    label: 'Board',    path: 'board',    Icon: RxDashboard },
  { id: 'list',     label: 'List',     path: 'list',     Icon: RxRows },
  { id: 'members',  label: 'Members',  path: 'members',  Icon: RxPerson },
  { id: 'settings', label: 'Settings', path: 'settings', Icon: RxGear },
];

export default async function ProjectLayout({ children, params }: ProjectLayoutProps) {
  const { projectId } = await params;

  let projectName: string | undefined;
  let subtitle: string | undefined;
  let term: string | undefined;
  let leads: ProjectHeaderLead[] = [];
  let memberCount = 0;
  let githubUrl: string | undefined;

  if (projectId) {
    const supabase = await createClient();
    const { data: project } = await supabase
      .from('projects')
      .select('projectName, projectDescription, year, quarter, projectLeads, projectMembers, githubUrl')
      .eq('id', projectId)
      .single();

    if (project) {
      projectName = project.projectName ?? undefined;
      subtitle = project.projectDescription ?? undefined;
      githubUrl = project.githubUrl ?? undefined;

      const yr = typeof project.year === 'string' ? project.year.slice(-2) : '';
      const q = typeof project.quarter === 'string' ? project.quarter : '';
      term = q || yr ? `${q} ${yr}`.trim() : undefined;

      const leadNames = Array.isArray(project.projectLeads) ? project.projectLeads : [];
      leads = leadNames.map((name: string) => ({
        name,
        color: pickAvatarColor(name),
      }));

      const allMembers = Array.isArray(project.projectMembers) ? project.projectMembers : [];
      memberCount = Math.max(0, allMembers.length);
    }
  }

  const items: SidebarItem[] = PROJECT_NAV.map((entry) => ({
    id: entry.id,
    label: entry.label,
    href: `/portal/projects/${projectId}/${entry.path}`,
    icon: <entry.Icon size={20} />,
  }));

  return (
    <div className="flex min-w-0 flex-1 flex-col text-text-primary">
      <ProjectHeaderBand
        projectName={projectName ?? 'Project'}
        eyebrowState="active project"
        subtitle={subtitle}
        term={term}
        leads={leads}
        memberCount={memberCount > 0 ? memberCount : undefined}
        githubUrl={githubUrl}
        actions={projectId ? <AddTaskHeaderButton projectId={projectId} /> : null}
      />

      <div className="flex min-w-0 flex-1">
        <Sidebar
          className="flex-shrink-0"
          ariaLabel="Project sections"
          label="Project"
          items={items}
          collapsible
        />
        <div className="min-w-0 flex-1 px-5 py-6 md:px-8 md:py-8">{children}</div>
        <ActivityPanel className="hidden xl:flex xl:flex-col" controlled />
      </div>
    </div>
  );
}