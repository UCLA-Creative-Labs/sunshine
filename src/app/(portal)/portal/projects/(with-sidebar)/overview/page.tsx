"use client";

import MyProjectContent from "@/components/MyProjectContent";

export default function Page() {
  return (
    <>
      <section className="space-y-2">
        <h1 className="text-3xl md:text-4xl font-semibold tracking-tight">
          My Project
        </h1>
      </section>
      <MyProjectContent />
    </>
  );
}
