import { redirect } from 'next/navigation';
import { getInternalRoleForUser, hasInternalRole } from '@/lib/internal/permissions';
import { Sidebar, SidebarHeader, type SidebarItem } from '@/components/portal/ui';
import { RxDashboard } from 'react-icons/rx';

const INTERNAL_NAV: SidebarItem[] = [
  {
    id: 'projects',
    label: 'Projects',
    href: '/portal/internal/projects',
    icon: <RxDashboard size={20} />,
  },
];

export default async function InternalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const userRoles = await getInternalRoleForUser();
  const isInternalUser = hasInternalRole(userRoles);

  if (!isInternalUser) {
    redirect('/portal');
  }

  return (
    <div className="flex flex-1 text-text-primary">
      <Sidebar
        className="flex-shrink-0"
        ariaLabel="Internal portal sections"
        header={<SidebarHeader title="Internal" />}
        items={INTERNAL_NAV}
      />
      <div className="flex-1 px-6 py-8 md:px-10 md:py-10">
        <div className="mx-auto max-w-5xl space-y-6">{children}</div>
      </div>
    </div>
  );
}
