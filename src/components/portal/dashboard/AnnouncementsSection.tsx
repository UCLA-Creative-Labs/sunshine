"use client";

import { useEffect, useState } from "react";
import { getAllAnnouncements } from "@/lib/eventsService";
import { ProjectAnnouncement } from "@/types/events";
import ProjectAnnouncementCard from "@/components/portal/ProjectAnnouncementCard";

function useMountAnimation(delay: number) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const timeout = setTimeout(() => setMounted(true), delay);
    return () => clearTimeout(timeout);
  }, [delay]);

  return mounted;
}

export default function AnnouncementsSection() {
  const mounted = useMountAnimation(0);
  const enterClasses = mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-3";

  const [announcements, setAnnouncements] = useState<ProjectAnnouncement[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchAnnouncements() {
      setLoading(true);
      const data = await getAllAnnouncements(6); // Limit to 6 announcements
      setAnnouncements(data);
      setLoading(false);
    }

    fetchAnnouncements();
  }, []);

  return (
    <section
      className={`transform transition-all duration-300 ease-out ${enterClasses}`}
    >
      <h2 className="text-xs font-semibold tracking-wide text-black/50 uppercase mb-4">
        Announcements
      </h2>
      <div className="rounded-2xl border border-[#D4D7E5] bg-white p-6 shadow-sm">
        {loading ? (
          <div className="text-center text-black/60 py-8">
            Loading announcements...
          </div>
        ) : announcements.length === 0 ? (
          <div className="text-center text-black/60 py-8">
            No announcements at this time.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {announcements.map((announcement) => (
              <ProjectAnnouncementCard
                key={announcement.id}
                announcement={announcement}
                compact
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
