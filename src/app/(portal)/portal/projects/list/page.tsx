"use client";

import MembershipPortalSidebar from "@/components/MembershipPortalSidebar";
import ProjectListContent from "@/components/ProjectListContent";

export default function Page() {
  return (
    <div className="flex flex-1 bg-[#F6F8FA] text-black">
        <MembershipPortalSidebar className="flex-shrink-0" />

        <div className="flex-1 px-6 py-10 md:px-16 md:py-12">
          <div className="mx-auto max-w-6xl space-y-6">
            <section className="space-y-2">
              <h1 className="text-3xl md:text-4xl font-semibold tracking-tight">
                List
              </h1>
            </section>

            <ProjectListContent />
          </div>
        </div>
    </div>
  );
}

