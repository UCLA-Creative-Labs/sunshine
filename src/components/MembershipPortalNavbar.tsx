"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";

const TAB_STYLES = {
  base: "relative px-0 py-1 text-sm md:text-base focus:outline-none focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-2 focus-visible:ring-offset-white transition-colors duration-150",
  selected: "font-semibold text-black",
  unselected: "font-normal text-black/60 hover:text-black",
  disabled: "opacity-40 cursor-not-allowed hover:text-black/60",
} as const;

export type MembershipPortalNavItem = {
  id: string;
  label: string;
  href?: string;
  disabled?: boolean;
};

export type TabNavItem = MembershipPortalNavItem;

export interface MembershipPortalNavbarProps {
  tabs: MembershipPortalNavItem[];
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  className?: string;
}

export default function MembershipPortalNavbar({
  tabs,
  value,
  defaultValue,
  onValueChange,
  className = "",
}: MembershipPortalNavbarProps) {
  const pathname = usePathname();
  const router = useRouter();

  const isControlled = value !== undefined;
  const [uncontrolledValue, setUncontrolledValue] = useState<string | undefined>(
    defaultValue ?? tabs[0]?.id
  );

  const derivedFromHrefId = (() => {
    if (!pathname) return undefined;
    const matchingTabs = tabs.filter((tab) => tab.href && pathname.startsWith(tab.href));
    if (matchingTabs.length === 0) return undefined;
    const bestMatch = matchingTabs.reduce((a, b) => 
      (a.href?.length ?? 0) > (b.href?.length ?? 0) ? a : b
    );
    return bestMatch.id;
  })();

  const currentValue =
    value !== undefined
      ? value
      : derivedFromHrefId !== undefined
      ? derivedFromHrefId
      : uncontrolledValue;

  // Keep internal state in sync if defaultValue changes
  useEffect(() => {
    if (!isControlled && defaultValue !== undefined) {
      setUncontrolledValue(defaultValue);
    }
  }, [defaultValue, isControlled]);

  const handleSelect = useCallback(
    (tab: MembershipPortalNavItem) => {
      if (tab.disabled) return;

      if (!isControlled) {
        setUncontrolledValue(tab.id);
      }

      onValueChange?.(tab.id);

      if (tab.href && pathname !== tab.href) {
        router.push(tab.href);
      }
    },
    [isControlled, onValueChange, pathname, router]
  );

  const listRef = useRef<HTMLDivElement | null>(null);

  const handleKeyDown = (event: React.KeyboardEvent<HTMLButtonElement>, idx: number) => {
    if (!listRef.current) return;

    const enabledTabs = tabs.map((tab, index) => ({ tab, index })).filter(({ tab }) => !tab.disabled);
    const currentEnabledIndex = enabledTabs.findIndex(({ index }) => index === idx);

    if (currentEnabledIndex === -1) return;

    const moveFocus = (direction: 1 | -1) => {
      const nextIndex = (currentEnabledIndex + direction + enabledTabs.length) % enabledTabs.length;
      const next = enabledTabs[nextIndex];
      const buttons = listRef.current?.querySelectorAll<HTMLButtonElement>("button[data-tab-id]");
      const nextButton = buttons?.[next.index];
      nextButton?.focus();
      handleSelect(next.tab);
    };

    switch (event.key) {
      case "ArrowRight":
      case "ArrowDown":
        event.preventDefault();
        moveFocus(1);
        break;
      case "ArrowLeft":
      case "ArrowUp":
        event.preventDefault();
        moveFocus(-1);
        break;
      case "Home": {
        event.preventDefault();
        const first = enabledTabs[0];
        const buttons = listRef.current?.querySelectorAll<HTMLButtonElement>("button[data-tab-id]");
        const firstButton = buttons?.[first.index];
        firstButton?.focus();
        handleSelect(first.tab);
        break;
      }
      case "End": {
        event.preventDefault();
        const last = enabledTabs[enabledTabs.length - 1];
        const buttons = listRef.current?.querySelectorAll<HTMLButtonElement>("button[data-tab-id]");
        const lastButton = buttons?.[last.index];
        lastButton?.focus();
        handleSelect(last.tab);
        break;
      }
      default:
        break;
    }
  };

  return (
    <header
      className={`w-full bg-white border-b-[2px] border-b-[#CDCCC8] px-6 md:px-8 py-6 ${className}`}
    >
      <div className="flex flex-col gap-4 md:flex-row md:items-center">
        <div className="flex items-center gap-3">
          <Image
            src="/cl-logo.svg"
            alt="Creative Labs Logo"
            width={36}
            height={36}
          />
          <span className={`font-[family-name:var(--font-mulish)] text-xl md:text-2xl font-extrabold tracking-wide text-black`}>
            CREATIVE LABS
          </span>
        </div>

        <nav aria-label="Membership portal navigation" className="md:flex-1">
          <div
            ref={listRef}
            role="tablist"
            className="flex items-center justify-center gap-8"
          >
            {tabs.map((tab, idx) => {
              const isSelected = tab.id === currentValue;
              const tabClassName = [
                TAB_STYLES.base,
                "font-[family-name:var(--font-mulish)]",
                isSelected ? TAB_STYLES.selected : TAB_STYLES.unselected,
                tab.disabled ? TAB_STYLES.disabled : "",
              ].join(" ");

              return (
                <button
                  key={tab.id}
                  type="button"
                  role="tab"
                  aria-selected={isSelected}
                  aria-disabled={tab.disabled}
                  disabled={tab.disabled}
                  data-tab-id={tab.id}
                  className={tabClassName}
                  onClick={() => handleSelect(tab)}
                  onKeyDown={(event) => handleKeyDown(event, idx)}
                >
                  <span className="relative inline-flex flex-col items-center">
                    <span>{tab.label}</span>
                    {isSelected && (
                      <span
                        className="mt-1 h-[2px] w-full bg-[#C7A1FF]"
                        aria-hidden="true"
                      />
                    )}
                  </span>
                </button>
              );
            })}
          </div>
        </nav>
      </div>
    </header>
  );
}
