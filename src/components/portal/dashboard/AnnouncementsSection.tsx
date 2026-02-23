"use client";

import { useEffect, useState, useCallback } from "react";
import { getAllAnnouncements, createAnnouncement } from "@/lib/supabase/eventsService";
import { ProjectAnnouncement, CreateAnnouncementInput } from "@/types/events";
import ProjectAnnouncementCard from "@/components/portal/ProjectAnnouncementCard";
import { DashboardAnnouncementModal } from "./DashboardAnnouncementModal";
import { supabase } from "@/lib/supabase/client";

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
  const [showModal, setShowModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [canPost, setCanPost] = useState(false);
  const [userProjects, setUserProjects] = useState<{ id: string; projectName: string; isLead: boolean }[]>([]);
  const [isDirectorOrPresident, setIsDirectorOrPresident] = useState(false);

  const fetchAnnouncements = useCallback(async () => {
    setLoading(true);
    const data = await getAllAnnouncements(6);
    setAnnouncements(data);
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchAnnouncements();
  }, [fetchAnnouncements]);

  // Check if user can post (is a project lead, director, or president)
  useEffect(() => {
    async function checkPermissions() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Check if user is a director or president (internal RBAC)
      const { data: internalRoles } = await supabase
        .from('user_context_roles')
        .select('roles!inner(name)')
        .eq('user_id', user.id);

      const roleNames = (internalRoles || []).map(
        (r) => ((r.roles as unknown as { name: string })?.name)
      );
      const isDirectorOrPresident = roleNames.some(
        (name) => name === 'director' || name === 'president'
      );

      // Check which projects the user leads
      const { data: memberships } = await supabase
        .from('project_members')
        .select('project_id, rbac_role_id, roles!inner(name), projects!inner(id, "projectName")')
        .eq('user_id', user.id);

      const projects = (memberships || []).map((m) => {
        const role = (m.roles as unknown as { name: string })?.name;
        const proj = m.projects as unknown as { id: string; projectName: string };
        return {
          id: proj?.id,
          projectName: proj?.projectName,
          isLead: role === 'project lead',
        };
      }).filter((p) => p.id);

      const leadsAnyProject = projects.some((p) => p.isLead);

      setUserProjects(projects.filter((p) => p.isLead));
      setIsDirectorOrPresident(isDirectorOrPresident);
      setCanPost(isDirectorOrPresident || leadsAnyProject);
    }

    checkPermissions();
  }, []);

  const handleCreateAnnouncement = async (input: CreateAnnouncementInput) => {
    setIsSubmitting(true);
    try {
      await createAnnouncement(input);
      await fetchAnnouncements();
      setShowModal(false);
    } catch (err) {
      console.error('Failed to create announcement:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section
      className={`transform transition-all duration-300 ease-out ${enterClasses}`}
    >
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xs font-semibold tracking-wide text-black/50 uppercase">
          Announcements
        </h2>
        {canPost && (
          <button
            onClick={() => setShowModal(true)}
            className="flex items-center gap-1.5 rounded-lg bg-[#3F86FF] px-3 py-1.5 text-xs font-medium text-white hover:bg-[#346edd] transition-colors"
          >
            <span className="text-base leading-none">+</span>
            <span>New Announcement</span>
          </button>
        )}
      </div>
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

      <DashboardAnnouncementModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onSubmit={handleCreateAnnouncement}
        userProjects={userProjects}
        isDirectorOrPresident={isDirectorOrPresident}
        isSubmitting={isSubmitting}
      />
    </section>
  );
}
