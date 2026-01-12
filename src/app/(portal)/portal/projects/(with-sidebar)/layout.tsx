"use client";

import MembershipPortalSidebar from "@/components/MembershipPortalSidebar";

export default function ProjectsSidebarLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-1 text-black">
      <MembershipPortalSidebar className="flex-shrink-0" />
      <div className="flex-1 px-6 py-8 md:px-10 md:py-10">
        <div className="mx-auto max-w-5xl space-y-6">
          {children}
        </div>
      </div>
    </div>
  );
}
