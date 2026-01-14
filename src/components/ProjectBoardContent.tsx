"use client";

import React, { useEffect, useState, useMemo } from "react";

const BUTTON_STYLES = {
  addTask: "mt-1 flex w-full items-center justify-center rounded-xl border border-dashed border-black/15 bg-white/60 px-3 py-2 text-[11px] md:text-xs font-medium text-black/70 transition-all duration-150 ease-out hover:bg-white hover:border-black/30 hover:-translate-y-0.5",
  primary: "inline-flex items-center gap-2 rounded-full bg-[#3F86FF] px-4 py-2 text-xs md:text-sm font-semibold text-white shadow-sm transition-all duration-200 ease-out hover:bg-[#346edd] hover:-translate-y-0.5 hover:shadow-md",
} as const;

function useMountAnimation(delay: number) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const timeout = setTimeout(() => setMounted(true), delay);
    return () => clearTimeout(timeout);
  }, [delay]);

  return mounted;
}

interface BoardColumnProps {
  title: string;
  accentColor: string;
  children: React.ReactNode;
  delay?: number;
}

function BoardColumn({ title, accentColor, children, delay = 0 }: BoardColumnProps) {
  const mounted = useMountAnimation(delay);
  const enterClasses = mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4";

  return (
    <section
      className={`flex-none w-[260px] space-y-3 transform transition-all duration-300 ease-out ${enterClasses}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      <h2
        className="text-base md:text-lg font-semibold tracking-tight"
        style={{ color: accentColor }}
      >
        {title}
      </h2>
      <div className="rounded-3xl bg-[#E5E7EB]/80 px-3 py-4 shadow-md">
        <div className="space-y-3">
          {children}
          <button type="button" className={BUTTON_STYLES.addTask}>
            + Add Task
          </button>
        </div>
      </div>
    </section>
  );
}

interface BoardCardProps {
  title: string;
  tag?: string;
  tagColor?: string;
  assignee?: string;
  dueDate?: string;
  delay?: number;
}

function getInitials(name: string): string {
  return name.split(" ").map((part) => part[0]).join("");
}

function AvatarStack({ initials }: { initials: string[] }) {
  return (
    <div className="flex -space-x-2">
      {initials.map((initial) => (
        <div
          key={initial}
          className="flex h-8 w-8 items-center justify-center rounded-full border border-white bg-[#FFEFAE] text-[11px] font-semibold text-black/70 shadow-sm"
        >
          {initial}
        </div>
      ))}
    </div>
  );
}

function BoardCard({ title, tag, tagColor = "#E5E7EB", assignee, dueDate, delay = 0 }: BoardCardProps) {
  const mounted = useMountAnimation(delay);
  const enterClasses = mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2";

  return (
    <div
      className={`rounded-2xl bg-white px-4 py-4 shadow-sm border border-white/70 transform transition-all duration-200 ease-out hover:-translate-y-0.5 hover:shadow-md ${enterClasses}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      <p className="text-xs md:text-sm font-medium text-black/80 truncate">{title}</p>
      <div className="mt-2 flex items-center justify-between gap-2">
        {tag && (
          <span
            className="inline-flex rounded-full px-2.5 py-0.5 text-[10px] font-medium text-black/70"
            style={{ backgroundColor: tagColor }}
          >
            {tag}
          </span>
        )}
        {dueDate && (
          <span className="text-[10px] text-black/50">Due {dueDate}</span>
        )}
      </div>
      {assignee && (
        <div className="mt-3 flex items-center gap-2">
          <div className="flex h-6 w-6 items-center justify-center rounded-full bg-[#E5E7EB] text-[10px] font-semibold text-black/70">
            {getInitials(assignee)}
          </div>
          <span className="text-[11px] text-black/70 truncate">{assignee}</span>
        </div>
      )}
    </div>
  );
}

// TODO: Fetch sprint and tasks data from database
export default function ProjectBoardContent() {
  const today = useMemo(() => new Date().toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }), []);

  return (
    <div className="flex flex-col gap-6">
      {/* Header row */}
      <header className="flex items-center justify-between gap-4 max-w-5xl">
        <div className="space-y-1">
          <p className="text-xs font-medium tracking-[0.18em] text-black/40 uppercase">
            Board View
          </p>
          {/* TODO: Replace with sprint.name from database */}
          <h1 className="text-2xl md:text-3xl font-semibold tracking-tight text-black">
            Sprint Alpha
          </h1>
          <p className="text-[11px] md:text-xs text-black/50">{today}</p>
        </div>
        {/* TODO: Replace with sprint.members from database */}
        <div className="flex items-center gap-4">
          <AvatarStack initials={["SV", "SL", "TN"]} />
          <button className={BUTTON_STYLES.primary}>
            <span className="text-base leading-none">+</span>
            <span>Add Task</span>
          </button>
        </div>
      </header>

      {/* Columns */}
      <div className="relative w-full">
        <div className="w-full max-w-full overflow-x-auto overflow-y-visible pb-4">
          {/* TODO: Replace BoardCards with tasks from database grouped by status */}
          <div className="flex gap-4 md:gap-6 lg:gap-8 min-w-[1400px]">
          <BoardColumn title="Todo" accentColor="#E1225C" delay={40}>
            <BoardCard
              title="Set up `project `repo"
              tag="Setup"
              tagColor="#FFE6D5"
              assignee="Sunny Vinay"
              dueDate="Nov 20"
              delay={60}
            />
            <BoardCard
              title="Draft user stories"
              tag="Product"
              tagColor="#FFE3E3"
              assignee="Shawn Lin"
              dueDate="Nov 21"
              delay={80}
            />
            <BoardCard
              title="Design login screen"
              tag="Design"
              tagColor="#EAF4FF"
              assignee="Stephanie Pham"
              dueDate="Nov 22"
              delay={100}
            />
          </BoardColumn>

          <BoardColumn title="In Progress" accentColor="#00C853" delay={80}>
            <BoardCard
              title="Implement membership navbar"
              tag="Frontend"
              tagColor="#E2F7E6"
              assignee="MJ Bagaoisan"
              dueDate="Nov 19"
              delay={100}
            />
            <BoardCard
              title="Hook up project API"
              tag="Backend"
              tagColor="#FFF1C2"
              assignee="Travis Nguyen"
              dueDate="Nov 23"
              delay={120}
            />
          </BoardColumn>

          <BoardColumn title="In Review" accentColor="#FF9100" delay={120}>
            <BoardCard
              title="Animate dashboard cards"
              tag="UX"
              tagColor="#FFF1C2"
              assignee="Sunny Vinnay"
              dueDate="Nov 18"
              delay={140}
            />
            <BoardCard
              title="Refactor auth flow"
              tag="Code Review"
              tagColor="#E5E7EB"
              assignee="Shawn Lin"
              dueDate="Nov 24"
              delay={160}
            />
          </BoardColumn>

          <BoardColumn title="Done" accentColor="#6200EA" delay={160}>
            <BoardCard
              title="Set up CI pipeline"
              tag="DevOps"
              tagColor="#EAF4FF"
              assignee="LeBron James"
              dueDate="Nov 15"
              delay={180}
            />
            <BoardCard
              title="Ship v0.1"
              tag="Release"
              tagColor="#E2F7E6"
              assignee="Stephanie Pham"
              dueDate="Nov 16"
              delay={200}
            />
          </BoardColumn>
          </div>
        </div>
      </div>
    </div>
  );
}
