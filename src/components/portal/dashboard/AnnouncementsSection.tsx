"use client";

import { useEffect, useState } from "react";

function useMountAnimation(delay: number) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const timeout = setTimeout(() => setMounted(true), delay);
    return () => clearTimeout(timeout);
  }, [delay]);

  return mounted;
}

interface Announcement {
  id: number;
  title: string;
  preview: string;
}

// TODO: Fetch announcements from database
const PLACEHOLDER_ANNOUNCEMENTS: Announcement[] = [
  { id: 1, title: "Announcement 1", preview: "Preview text..." },
  { id: 2, title: "Announcement 2", preview: "Preview text..." },
  { id: 3, title: "Announcement 3", preview: "Preview text..." },
];

export default function AnnouncementsSection() {
  const mounted = useMountAnimation(0);
  const enterClasses = mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-3";

  return (
    <section
      className={`transform transition-all duration-300 ease-out ${enterClasses}`}
    >
      <h2 className="text-xs font-semibold tracking-wide text-black/50 uppercase mb-4">
        Announcements
      </h2>
      <div className="rounded-2xl border border-[#D4D7E5] bg-white p-6 shadow-sm">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {PLACEHOLDER_ANNOUNCEMENTS.map((announcement) => (
            <div
              key={announcement.id}
              className="rounded-lg border border-[#E2E4F0] p-4 hover:bg-gray-50 transition-colors cursor-pointer"
            >
              <h3 className="font-semibold text-black mb-1">{announcement.title}</h3>
              <p className="text-sm text-black/60">{announcement.preview}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
