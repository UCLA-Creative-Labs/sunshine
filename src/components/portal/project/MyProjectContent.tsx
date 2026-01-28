"use client";

import React, { memo, useEffect, useState } from "react";
import Image from "next/image";
import { FaGithub } from "react-icons/fa6";
import { SiFigma, SiNotion } from "react-icons/si";
import { getProjectByUserId } from "@/lib/supabase/projectService";
import { Project } from "@/types/project";

const CARD_STYLES = {
  base: "rounded-2xl border border-[#D4D7E5] bg-white p-6 md:p-8 shadow-lg transform transition-all duration-300 ease-out hover:-translate-y-1 hover:shadow-xl",
  titleDefault: "mb-3 text-xl font-semibold tracking-tight text-black",
} as const;

const AVATAR_STYLES = {
  large: "flex h-14 w-14 items-center justify-center overflow-hidden rounded-full bg-[#E5E7EB]",
  medium: "h-10 w-10 flex-shrink-0 overflow-hidden rounded-full bg-[#E5E7EB]",
  small: "inline-flex h-8 w-8 items-center justify-center overflow-hidden rounded-full bg-[#E5E7EB]",
} as const;

function useMountAnimation(delay: number) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const timeout = setTimeout(() => setMounted(true), delay);
    return () => clearTimeout(timeout);
  }, [delay]);

  return mounted;
}

interface SectionProps {
  title: string;
  children: React.ReactNode;
  className?: string;
  titleClassName?: string;
  delay?: number;
}

function Section({ title, children, className = "", titleClassName, delay = 0 }: SectionProps) {
  const mounted = useMountAnimation(delay);
  const enterClasses = mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-3";

  return (
    <section
      className={`${className} transform transition-all duration-300 ease-out ${enterClasses}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      <h2 className={titleClassName ?? CARD_STYLES.titleDefault}>
        {title}
      </h2>
      <div className={CARD_STYLES.base}>
        {children}
      </div>
    </section>
  );
}

function TaskLink({ children }: { children: React.ReactNode }) {
  return <span className="font-semibold text-[#3F86FF]">{children}</span>;
}

interface ActivityItemProps {
  name: string;
  time: string;
  action: React.ReactNode;
  comment?: string;
}

function ActivityItem({ name, time, action, comment }: ActivityItemProps) {
  return (
    <div className="flex gap-3">
      <div className={AVATAR_STYLES.medium}>
        <Image
          src="/images/default-avatar.svg"
          alt={`${name} avatar`}
          width={40}
          height={40}
          className="h-full w-full object-cover"
        />
      </div>
      <div className="flex-1">
        <div className="mb-1 flex items-center justify-between">
          <p className="font-semibold">{name}</p>
          <p className="text-[10px] md:text-[11px] text-black/50">{time}</p>
        </div>
        <p>{action}</p>
        {comment && (
          <div className="mt-2 inline-block rounded-2xl bg-[#EAF4FF] px-4 py-3 text-[11px] md:text-xs text-black/80">
            {comment}
          </div>
        )}
      </div>
    </div>
  );
}

// Hardcoded user ID - to be replaced with auth later
const HARDCODED_USER_ID = "57fb265d-0e1d-4b1e-adef-f9380ebd670d";

// TODO: Fetch project data from database (description, leads, tasks, activity)
export default function MyProjectContent() {
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchProject() {
      try {
        setLoading(true);
        const data = await getProjectByUserId(HARDCODED_USER_ID);
        setProject(data);
      } catch (err) {
        setError("Failed to load project data");
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchProject();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <p className="text-black/60">Loading project...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center py-20">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="flex items-center justify-center py-20">
        <p className="text-black/60">No project found for this user.</p>
      </div>
    );
  }

  return (
    <>
      {/* Project Name from database */}
      <section className="space-y-2 mb-10">
        <h1 className="text-3xl md:text-4xl font-semibold tracking-tight">
          {project.projectName || "My Project"}
        </h1>
      </section>
      <div className="grid gap-10 lg:gap-14 lg:grid-cols-[minmax(0,2fr)_minmax(260px,1fr)]">
        {/* Left column */}
        <div className="space-y-14">
          {/* Project Description from database */}
          <Section title="Project Description" delay={0}>
            <p className="text-sm md:text-base text-black/80">
              {project.projectDescription || "No description available."}
            </p>
          </Section>

          {/* Project Leads from database */}
          <Section title="Project Leads" delay={80}>
            <div className="flex flex-wrap gap-4">
              {project.projectLeads && project.projectLeads.length > 0 ? (
                project.projectLeads.map((lead, index) => (
                  <div key={index} className="flex items-center gap-4">
                    <div className={AVATAR_STYLES.large}>
                      <Image
                        src="/images/default-avatar.svg"
                        alt={`${lead} avatar`}
                        width={56}
                        height={56}
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm font-semibold text-[#E1225C]">
                        {lead}
                      </p>
                      <p className="text-xs text-black/70">Project Lead</p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-sm text-black/60">No project leads assigned.</p>
              )}
            </div>
          </Section>

          {/* TODO: Replace with user's assigned tasks from database */}
          <Section title="My Tasks" delay={160}>
            <div className="overflow-x-auto">
              <table className="min-w-full text-left text-xs md:text-sm text-black/80">
                <thead>
                  <tr className="border-b border-[#E2E4F0]">
                    <th className="pb-3 pr-6 font-semibold">Name</th>
                    <th className="pb-3 pr-6 font-semibold">Priority</th>
                    <th className="pb-3 pr-6 font-semibold">Topic</th>
                    <th className="pb-3 pr-6 font-semibold">Status</th>
                    <th className="pb-3 font-semibold">Assignee</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="py-4 pr-6 align-middle">
                      <span className="text-black/60 mr-1">#67</span>
                      Follow CL on IG!
                    </td>
                    <td className="py-4 pr-6 align-middle">
                      <span className="rounded-full bg-[#FFE3E3] px-3 py-1 text-xs font-medium text-[#E1225C]">
                        High
                      </span>
                    </td>
                    <td className="py-4 pr-6 align-middle">
                      <span className="rounded-full bg-[#FFE6D5] px-3 py-1 text-xs font-medium text-[#D26A00]">
                        Bug
                      </span>
                    </td>
                    <td className="py-4 pr-6 align-middle">
                      <span className="rounded-full bg-[#E2F7E6] px-3 py-1 text-xs font-medium text-[#1F7A3D]">
                        In-Progress
                      </span>
                    </td>
                    <td className="py-4 align-middle">
                      <span className={AVATAR_STYLES.small}>
                        <Image
                          src="/images/default-avatar.svg"
                          alt="Task assignee avatar"
                          width={32}
                          height={32}
                          className="h-full w-full object-cover"
                        />
                      </span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </Section>
        </div>

        {/* Right column */}
        <div className="space-y-14">
          {/* TODO: Replace with project.recentActivity from database */}
          <Section title="Recent Activity" delay={240}>
            <div className="space-y-7 text-xs md:text-sm text-black/80">
              <ActivityItem
                name="Sunny Vinay"
                time="9:05 AM"
                action={<>Created task <TaskLink>"Design onboarding flow"</TaskLink></>}
              />
              <ActivityItem
                name="Shawn Lin"
                time="9:42 AM"
                action="Commented on sprint planning"
                comment="Can we move this story to the next sprint?"
              />
              <ActivityItem
                name="Stephanie Pham"
                time="10:15 AM"
                action={<>Updated status of <TaskLink>"Landing page redesign"</TaskLink> to In Progress</>}
              />
              <ActivityItem
                name="Travis Nguyen"
                time="11:02 AM"
                action='Completed task "Hook up API to dashboard"'
              />
              <ActivityItem
                name="MJ Bagaoisan"
                time="11:45 AM"
                action="Reviewed pull request #42"
              />
              <ActivityItem
                name="LeBron James"
                time="12:10 PM"
                action="Assigned as project lead"
              />
            </div>
          </Section>

          <Section
            title="Quick Links"
            delay={320}
          >
            <div className="flex items-center justify-center gap-6 text-sm text-black/80">
              <a
                href="#"
                className="flex h-10 w-10 items-center justify-center rounded-full border border-black bg-white hover:bg-black hover:text-white transform transition-transform transition-colors duration-200 ease-out hover:-translate-y-0.5 hover:scale-105"
                aria-label="GitHub"
              >
                <FaGithub className="h-5 w-5" />
              </a>
              <a
                href="#"
                className="flex h-10 w-10 items-center justify-center rounded-full border border-black bg-white hover:bg-black hover:text-white transform transition-transform transition-colors duration-200 ease-out hover:-translate-y-0.5 hover:scale-105"
                aria-label="Figma"
              >
                <SiFigma className="h-5 w-5" />
              </a>
              <a
                href="#"
                className="flex h-10 w-10 items-center justify-center rounded-full border border-black bg-white hover:bg-black hover:text-white transform transition-transform transition-colors duration-200 ease-out hover:-translate-y-0.5 hover:scale-105"
                aria-label="Notion"
              >
                <SiNotion className="h-5 w-5" />
              </a>
            </div>
          </Section>
        </div>
      </div>
    </>
  );
}
