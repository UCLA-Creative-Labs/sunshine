// Portal-specific layout with sidebar/navigation
// This layout applies to all pages under /portal/*

import MembershipPortalNavbar from '@/components/MembershipPortalNavbar';
import {
  SHOW_INTERNAL_TAB_TO_INTERNAL_USERS_ONLY,
  getInternalRoleForUser,
  hasInternalRole,
} from '@/lib/internal/permissions';

const BASE_PORTAL_TABS = [
  { id: 'dashboard', label: 'Dashboard', href: '/portal' },
  { id: 'project-directory', label: 'Project Directory', href: '/portal/directory' },
  { id: 'my-project', label: 'My Project', href: '/portal/my-project' },
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
      <MembershipPortalNavbar tabs={portalTabs} />
      <main className="flex flex-1 bg-[#F6F8FA]">{children}</main>
    </div>
  );
}
