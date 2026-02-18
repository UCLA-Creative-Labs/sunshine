"use client";

import React, { useCallback, useMemo } from "react";
import { usePathname, useRouter } from "next/navigation";
import {
  RxHome,
  RxDashboard,
  RxRows,
  RxPerson,
  RxFileText,
} from "react-icons/rx";

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

const BASE_ITEMS = [
  { id: "overview", label: "Overview", path: "overview", icon: RxHome },
  { id: "board", label: "Board", path: "board", icon: RxDashboard },
  { id: "list", label: "List", path: "list", icon: RxRows },
  { id: "members", label: "Members", path: "members", icon: RxPerson },
  { id: "docs", label: "Docs", path: "docs", icon: RxFileText },
];

export default function MembershipPortalSidebar({
  projectName,
  items,
  className = "",
}: MembershipPortalSidebarProps) {
  const pathname = usePathname();
  const router = useRouter();

  const projectId = useMemo(() => {
    const match = pathname?.match(/\/portal\/projects\/([^\/]+)/);
    return match ? match[1] : null;
  }, [pathname]);

  // Build nav items using the projectId extracted from the current path
  const navItems = useMemo(() => {
    if (items) return items;

    if (!projectId) return [];

    return BASE_ITEMS.map(item => ({
      ...item,
      href: `/portal/projects/${projectId}/${item.path}`,
    }));
  }, [projectId, items]);

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
            {projectName}
          </span>
        </div>
      </div>

      <nav className="flex flex-col gap-4" aria-label="Member portal sections">
        {navItems.map((item) => {
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
