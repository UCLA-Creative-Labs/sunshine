import { Sidebar, SidebarHeader, type SidebarItem } from '@/components/portal/ui';
import { RxHome, RxDashboard, RxRows, RxPerson, RxFileText, RxGear } from 'react-icons/rx';
import { createClient } from '@/lib/supabase/server';

interface ProjectLayoutProps {
  children: React.ReactNode;
  params: Promise<{ projectId: string }>;
}

const PROJECT_NAV: Array<{ id: string; label: string; path: string; icon: SidebarItem['icon'] }> = [
  { id: 'overview', label: 'Overview', path: 'overview', icon: RxHome },
  { id: 'board',    label: 'Board',    path: 'board',    icon: RxDashboard },
  { id: 'list',     label: 'List',     path: 'list',     icon: RxRows },
  { id: 'members',  label: 'Members',  path: 'members',  icon: RxPerson },
  { id: 'docs',     label: 'Docs',     path: 'docs',     icon: RxFileText },
  { id: 'settings', label: 'Settings', path: 'settings', icon: RxGear },
];

export default async function ProjectLayout({ children, params }: ProjectLayoutProps) {
  const { projectId } = await params;

  let projectName: string | undefined;
  let logoUrl: string | undefined;
  if (projectId) {
    const supabase = await createClient();
    const { data } = await supabase
      .from('projects')
      .select('projectName, logoUrl')
      .eq('id', projectId)
      .single();
    projectName = data?.projectName ?? undefined;
    logoUrl = data?.logoUrl ?? undefined;
  }

  const items: SidebarItem[] = PROJECT_NAV.map((item) => ({
    id: item.id,
    label: item.label,
    href: `/portal/projects/${projectId}/${item.path}`,
    icon: item.icon,
  }));

  return (
    <div className="flex flex-1 text-text-primary">
      <Sidebar
        className="flex-shrink-0"
        ariaLabel="Project sections"
        header={<SidebarHeader title={projectName ?? 'Project'} logoUrl={logoUrl} />}
        items={items}
      />
      <div className="flex-1 px-6 py-8 md:px-10 md:py-10">
        <div className="mx-auto max-w-5xl space-y-6">{children}</div>
      </div>
    </div>
  );
}
