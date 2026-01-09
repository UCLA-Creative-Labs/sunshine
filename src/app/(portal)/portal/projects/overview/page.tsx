"use client";

import MembershipPortalSidebar from "@/components/MembershipPortalSidebar";
import MyProjectContent from "@/components/MyProjectContent";

export default function Page() {
  return (
    <div className="flex flex-1 bg-[#F6F8FA] text-black">
        {/* Left sidebar */}
        <MembershipPortalSidebar className="flex-shrink-0" />

        {/* Right content area */}
        <div className="flex-1 px-6 py-10 md:px-16 md:py-12">
          <div className="mx-auto max-w-5xl space-y-6">
            <section className="space-y-2">
              <h1 className="text-3xl md:text-4xl font-semibold tracking-tight">
                My Project
              </h1>
            </section>

            <MyProjectContent />
          </div>
        </div>
    </div>
  );
}