"use client";

import React, { useCallback, useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import {
  RxHome,
  RxDashboard,
  RxRows,
  RxPerson,
  RxFileText,
} from "react-icons/rx";
import { getProjectByUserId } from "@/lib/supabase/projectService";

// Hardcoded user ID - to be replaced with auth later
const HARDCODED_USER_ID = "57fb265d-0e1d-4b1e-adef-f9380ebd670d";

export type MembershipPortalSidebarItem = {
  id: string;
  label: string;
  href?: string;
  icon: React.ComponentType<{ size?: number }>;
};

export interface MembershipPortalSidebarProps {
  projectName?: string;
  items?: MembershipPortalSidebarItem[];
  className?: string;
}

const NAV_STYLES = {
  base: "flex items-center gap-3 rounded-xl px-3 py-3 text-l transition-colors duration-150",
  active: "bg-[rgba(108,162,255,0.25)] text-[#3F86FF]",
  inactive: "text-gray-600 hover:bg-gray-100",
} as const;

// TODO: we should use /portal/projects/[id] for dynamic project IDs
const DEFAULT_ITEMS: MembershipPortalSidebarItem[] = [
  { id: "overview", label: "Overview", href: "/portal/projects/overview", icon: RxHome },
  { id: "board", label: "Board", href: "/portal/projects/board", icon: RxDashboard },
  { id: "list", label: "List", href: "/portal/projects/list", icon: RxRows },
  { id: "members", label: "Members", href: "/portal/projects/members", icon: RxPerson },
  { id: "docs", label: "Docs", href: "/portal/projects/docs", icon: RxFileText },
];

export default function MembershipPortalSidebar({
  projectName = "Project Name",
  items = DEFAULT_ITEMS,
  className = "",
}: MembershipPortalSidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [fetchedProjectName, setFetchedProjectName] = useState<string | null>(null);

  useEffect(() => {
    async function fetchProjectName() {
      try {
        const project = await getProjectByUserId(HARDCODED_USER_ID);
        if (project && project.projectName) {
          setFetchedProjectName(project.projectName);
        }
      } catch (error) {
        console.error("Failed to fetch project name for sidebar:", error);
      }
    }
    fetchProjectName();
  }, []);

  const handleSelect = useCallback(
    (item: MembershipPortalSidebarItem) => {
      if (!item.href) return;
      if (pathname !== item.href) {
        router.push(item.href);
      }
    },
    [pathname, router]
  );

  return (
    <aside
      className={`flex min-h-screen flex-col border-r-[2px] border-[#CDCCC8] bg-white px-6 py-6 w-60 ${className}`}
    >
      <div className="mt-4 mb-12 flex items-center gap-3">
        <div className="h-10 w-10 rounded-full bg-[#FFB3D9]" />
        <div className="flex flex-col">
          <span
            className="font-bold"
            style={{ color: "#6468B0", fontSize: "24px", lineHeight: 1.1 }}
          >
            {fetchedProjectName || projectName}
          </span>
        </div>
      </div>

      <nav className="flex flex-col gap-4" aria-label="Member portal sections">
        {items.map((item) => {
          const isActive = item.href ? pathname?.startsWith(item.href) : false;
          const Icon = item.icon;
          const navClassName = [
            NAV_STYLES.base,
            isActive ? NAV_STYLES.active : NAV_STYLES.inactive,
          ].join(" ");

          return (
            <button
              key={item.id}
              type="button"
              onClick={() => handleSelect(item)}
              className={navClassName}
            >
              <Icon size={20} />
              <span className="font-semibold">{item.label}</span>
            </button>
          );
        })}
      </nav>
    </aside>
  );
}
