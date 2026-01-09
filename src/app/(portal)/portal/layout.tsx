// Portal-specific layout with sidebar/navigation
// This layout applies to all pages under /portal/*

import MembershipPortalNavbar from '@/components/MembershipPortalNavbar';

const portalTabs = [
    { id: 'dashboard', label: 'Dashboard', href: '/portal' },
    { id: 'project-directory', label: 'Project Directory', href: '/portal/projects' },
    { id: 'my-project', label: 'My Project', href: '/portal/projects/overview' },
    { id: 'member-directory', label: 'Member Directory', href: '/portal/directory' },
    { id: 'profile', label: 'Profile', href: '/portal/profile' },
];

export default function PortalPageLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="min-h-screen">
            <MembershipPortalNavbar tabs={portalTabs} />
            <main>{children}</main>
        </div>
    );
}
