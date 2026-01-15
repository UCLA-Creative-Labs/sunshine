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

const DAYS_OF_WEEK = ["S", "M", "T", "W", "T", "F", "S"];

function getDaysInMonth(year: number, month: number): number {
  return new Date(year, month + 1, 0).getDate();
}

function getFirstDayOfMonth(year: number, month: number): number {
  return new Date(year, month, 1).getDay();
}

export default function CalendarSection() {
  const mounted = useMountAnimation(160);
  const enterClasses = mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-3";

  const today = new Date();
  const [currentYear, setCurrentYear] = useState(today.getFullYear());
  const [currentMonth, setCurrentMonth] = useState(today.getMonth());

  const daysInMonth = getDaysInMonth(currentYear, currentMonth);
  const firstDayOfMonth = getFirstDayOfMonth(currentYear, currentMonth);

  const monthName = new Date(currentYear, currentMonth).toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });

  // Create calendar grid
  const calendarDays: (number | null)[] = [];

  // Add empty cells for days before the first day of the month
  for (let i = 0; i < firstDayOfMonth; i++) {
    calendarDays.push(null);
  }

  // Add the days of the month
  for (let day = 1; day <= daysInMonth; day++) {
    calendarDays.push(day);
  }

  const isToday = (day: number | null) => {
    if (day === null) return false;
    return (
      day === today.getDate() &&
      currentMonth === today.getMonth() &&
      currentYear === today.getFullYear()
    );
  };

  return (
    <section
      className={`transform transition-all duration-300 ease-out ${enterClasses}`}
      style={{ transitionDelay: "160ms" }}
    >
      <h2 className="text-xs font-semibold tracking-wide text-black/50 uppercase mb-4">
        Calendar & Events
      </h2>
      <div className="rounded-2xl border border-[#D4D7E5] bg-white p-6 shadow-sm">
        {/* Month header */}
        <div className="text-center mb-4">
          <h3 className="text-base font-semibold text-black">{monthName}</h3>
        </div>

        {/* Day headers */}
        <div className="grid grid-cols-7 gap-1 mb-2">
          {DAYS_OF_WEEK.map((day, index) => (
            <div
              key={index}
              className="text-center text-xs font-medium text-black/50 py-2"
            >
              {day}
            </div>
          ))}
        </div>

        {/* Calendar grid */}
        <div className="grid grid-cols-7 gap-1">
          {calendarDays.map((day, index) => (
            <div
              key={index}
              className={`
                aspect-square flex items-center justify-center text-sm
                ${day ? "hover:bg-gray-100 cursor-pointer rounded-md" : ""}
                ${isToday(day) ? "bg-[#3F86FF] text-white rounded-md font-semibold" : "text-black/80"}
              `}
            >
              {day}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
