"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

function useMountAnimation(delay: number) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const timeout = setTimeout(() => setMounted(true), delay);
    return () => clearTimeout(timeout);
  }, [delay]);

  return mounted;
}

interface ProjectInfo {
  name: string;
  teamMembers: string[];
  currentWeek: number;
  totalWeeks: number;
}

// TODO: Fetch current project from database
const PLACEHOLDER_PROJECT: ProjectInfo = {
  name: "Project Name",
  teamMembers: ["Name", "Name", "Name"],
  currentWeek: 3,
  totalWeeks: 10,
};

export default function CurrentProjectSection() {
  const mounted = useMountAnimation(80);
  const enterClasses = mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-3";

  const progressPercent = (PLACEHOLDER_PROJECT.currentWeek / PLACEHOLDER_PROJECT.totalWeeks) * 100;

  return (
    <section
      className={`transform transition-all duration-300 ease-out ${enterClasses}`}
      style={{ transitionDelay: "80ms" }}
    >
      <h2 className="text-xs font-semibold tracking-wide text-black/50 uppercase mb-4">
        Current Project <span className="font-normal">(for external project members only)</span>
      </h2>
      <div className="rounded-2xl border border-[#D4D7E5] bg-white p-6 shadow-sm">
        <h3 className="text-lg font-semibold text-black mb-2">
          {PLACEHOLDER_PROJECT.name}
        </h3>
        <p className="text-sm text-black/70 mb-2">
          Team: {PLACEHOLDER_PROJECT.teamMembers.join(", ")}
        </p>
        <p className="text-sm text-black/70 mb-3">
          Week {PLACEHOLDER_PROJECT.currentWeek} of {PLACEHOLDER_PROJECT.totalWeeks}
        </p>

        {/* Progress bar */}
        <div className="w-full h-2 bg-gray-200 rounded-full mb-4">
          <div
            className="h-full bg-[#3F86FF] rounded-full transition-all duration-300"
            style={{ width: `${progressPercent}%` }}
          />
        </div>

        <Link
          href="/portal/projects"
          className="inline-block px-4 py-2 text-sm font-medium text-black border border-black rounded-md hover:bg-black hover:text-white transition-colors"
        >
          Go to Workspace
        </Link>
      </div>
    </section>
  );
}
