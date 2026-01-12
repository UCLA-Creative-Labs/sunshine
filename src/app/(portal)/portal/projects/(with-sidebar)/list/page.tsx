"use client";

import ProjectListContent from "@/components/ProjectListContent";

export default function Page() {
  return (
    <>
      <section className="space-y-2">
        <h1 className="text-3xl md:text-4xl font-semibold tracking-tight">
          List
        </h1>
      </section>
      <ProjectListContent />
    </>
  );
}
