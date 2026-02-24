// Portal-specific layout with sidebar/navigation
// This layout applies to all pages under /portal/*

import MembershipPortalNavbar from '@/components/MembershipPortalNavbar';

const portalTabs = [
    { id: 'dashboard', label: 'Dashboard', href: '/portal' },
    { id: 'project-directory', label: 'Project Directory', href: '/portal/directory' },
    { id: 'my-project', label: 'My Project', href: '/portal/my-project' },
    { id: 'profile', label: 'Profile', href: '/portal/profile' },
];

export default function PortalPageLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="min-h-screen flex flex-col">
            <MembershipPortalNavbar tabs={portalTabs} />
            <main className="flex flex-1 bg-[#F6F8FA]">{children}</main>
        </div>
    );
}
