// Portal-specific layout with sidebar navigation
// This layout applies to all pages under /portal/*

import Navbar from '@/components/Navbar';
import PortalSidebar from './components/PortalSidebar';

export default function PortalPageLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <>
            <Navbar />
            <div className="flex min-h-screen bg-white pt-24">
                <PortalSidebar />
                <main className="flex-1 p-8">
                    <div className="max-w-7xl mx-auto">
                        {children}
                    </div>
                </main>
            </div>
        </>
    );
}
