"use client";

import React, { useCallback } from "react";
import { usePathname, useRouter } from "next/navigation";
import { RxDashboard } from "react-icons/rx";

const NAV_STYLES = {
  base: "flex items-center gap-3 rounded-xl px-3 py-3 text-l transition-colors duration-150",
  active: "bg-[rgba(108,162,255,0.25)] text-[#3F86FF]",
  inactive: "text-gray-600 hover:bg-gray-100",
} as const;

const COMMITTEE_ITEMS = [
  { id: "projects", label: "Projects", href: "/portal/internal/projects", icon: RxDashboard },
] as const;

export default function InternalSidebar({ className = "" }: { className?: string }) {
  const pathname = usePathname();
  const router = useRouter();

  const handleSelect = useCallback(
    (href: string) => {
      if (pathname !== href) router.push(href);
    },
    [pathname, router]
  );

  return (
    <aside
      className={`flex min-h-screen flex-col border-r-[2px] border-[#CDCCC8] bg-white px-6 py-6 w-60 ${className}`}
    >
      <div className="mt-4 mb-12 flex items-center gap-3">
        <span
          className="font-bold"
          style={{ color: "#6468B0", fontSize: "24px", lineHeight: 1.1 }}
        >
          Internal
        </span>
      </div>

      <nav className="flex flex-col gap-4" aria-label="Internal portal sections">
        {COMMITTEE_ITEMS.map((item) => {
          const isActive = pathname?.startsWith(item.href) ?? false;
          const Icon = item.icon;
          const navClassName = [
            NAV_STYLES.base,
            isActive ? NAV_STYLES.active : NAV_STYLES.inactive,
          ].join(" ");

          return (
            <button
              key={item.id}
              type="button"
              onClick={() => handleSelect(item.href)}
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
