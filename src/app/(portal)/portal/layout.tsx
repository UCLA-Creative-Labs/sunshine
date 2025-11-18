// Portal-specific layout with sidebar/navigation
// This layout applies to all pages under /portal/*

import PortalNavbar from '@/components/PortalNavbar';

export default function PortalPageLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="min-h-screen">
            <PortalNavbar />
            <main className="pt-24">{children}</main>
        </div>
    );
}
