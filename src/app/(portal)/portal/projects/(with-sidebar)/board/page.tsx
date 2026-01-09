"use client";

import ProjectBoardContent from "@/components/ProjectBoardContent";

export default function Page() {
  return (
    <>
      <section className="space-y-2">
        <h1 className="text-3xl md:text-4xl font-semibold tracking-tight">
          Board
        </h1>
      </section>
      <ProjectBoardContent />
    </>
  );
}
