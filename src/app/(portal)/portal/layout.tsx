import { Avatar, PortalNavbar } from '@/components/portal/ui';
import {
  SHOW_INTERNAL_TAB_TO_INTERNAL_USERS_ONLY,
  getInternalRoleForUser,
  hasInternalRole,
} from '@/lib/internal/permissions';

const BASE_PORTAL_TABS = [
  { id: 'dashboard', label: 'Dashboard', href: '/portal' },
  { id: 'project-directory', label: 'Project Directory', href: '/portal/directory' },
  { id: 'my-project', label: 'My Project', href: '/portal/my-project' },
  { id: 'members', label: 'Members', href: '/portal/members' },
  { id: 'profile', label: 'Profile', href: '/portal/profile' },
];

const INTERNAL_TAB = {
  id: 'internal',
  label: 'Internal',
  href: '/portal/internal',
};

export default async function PortalPageLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Server-side role check: determine whether to show Internal tab
  const userRoles = await getInternalRoleForUser();
  const isInternalUser = hasInternalRole(userRoles);

  const showInternalTab = SHOW_INTERNAL_TAB_TO_INTERNAL_USERS_ONLY
    ? isInternalUser
    : true;

  const portalTabs = showInternalTab
    ? [...BASE_PORTAL_TABS, INTERNAL_TAB]
    : BASE_PORTAL_TABS;

  return (
    <div className="min-h-screen flex flex-col">
      <PortalNavbar
        tabs={portalTabs}
        trailing={<Avatar name="MJ Bagaoisan" size="sm" color="blue" />}
      />
      <main className="flex flex-1 bg-surface">{children}</main>
    </div>
  );
}
