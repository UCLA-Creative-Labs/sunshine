"use client";

import { useEffect, useState } from "react";
import { getUpcomingEvents } from "@/lib/supabase/eventsService";
import { ProjectEvent } from "@/types/events";
import ProjectEventCard from "@/components/portal/ProjectEventCard";

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
  const [events, setEvents] = useState<ProjectEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [hoveredDay, setHoveredDay] = useState<number | null>(null);

  useEffect(() => {
    async function fetchEvents() {
      setLoading(true);
      const data = await getUpcomingEvents();
      setEvents(data);
      setLoading(false);
    }

    fetchEvents();
  }, []);

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

  const hasEvent = (day: number | null) => {
    if (day === null) return false;
    return events.some((event) => {
      const eventDate = new Date(event.event_date);
      return (
        eventDate.getDate() === day &&
        eventDate.getMonth() === currentMonth &&
        eventDate.getFullYear() === currentYear
      );
    });
  };

  const getEventsForDay = (day: number | null): ProjectEvent[] => {
    if (day === null) return [];
    return events.filter((event) => {
      const eventDate = new Date(event.event_date);
      return (
        eventDate.getDate() === day &&
        eventDate.getMonth() === currentMonth &&
        eventDate.getFullYear() === currentYear
      );
    });
  };

  const goToPreviousMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(currentYear - 1);
    } else {
      setCurrentMonth(currentMonth - 1);
    }
  };

  const goToNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(currentYear + 1);
    } else {
      setCurrentMonth(currentMonth + 1);
    }
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
        {/* Month header with navigation */}
        <div className="flex items-center justify-between mb-4">
          <button
            onClick={goToPreviousMonth}
            className="p-2 hover:bg-gray-100 rounded-md transition"
            aria-label="Previous month"
          >
            <svg className="w-5 h-5 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          <h3 className="text-base font-semibold text-black">{monthName}</h3>

          <button
            onClick={goToNextMonth}
            className="p-2 hover:bg-gray-100 rounded-md transition"
            aria-label="Next month"
          >
            <svg className="w-5 h-5 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
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
        <div className="grid grid-cols-7 gap-1 mb-6">
          {calendarDays.map((day, index) => {
            const dayEvents = getEventsForDay(day);
            return (
              <div
                key={index}
                className={`
                  aspect-square flex flex-col items-center justify-center text-sm relative
                  ${day ? "hover:bg-gray-100 cursor-pointer rounded-md" : ""}
                  ${isToday(day) ? "bg-[#3F86FF] text-white rounded-md font-semibold" : "text-black/80"}
                `}
                onMouseEnter={() => setHoveredDay(day)}
                onMouseLeave={() => setHoveredDay(null)}
              >
                {day}
                {hasEvent(day) && (
                  <div className={`w-1 h-1 rounded-full mt-0.5 ${isToday(day) ? "bg-white" : "bg-blue-600"}`} />
                )}
                {hoveredDay === day && dayEvents.length > 0 && (
                  <div className="absolute z-50 bottom-full left-1/2 -translate-x-1/2 mb-2 w-64 bg-white border-2 border-gray-300 rounded-lg shadow-xl p-3">
                    <div className="space-y-2">
                      {dayEvents.map((event) => (
                        <div key={event.id} className="text-left">
                          <p className="font-bold text-xs text-gray-900">{event.title}</p>
                          {event.event_time_display && (
                            <p className="text-xs text-gray-600">{event.event_time_display}</p>
                          )}
                          {event.location && (
                            <p className="text-xs text-gray-500">📍 {event.location}</p>
                          )}
                        </div>
                      ))}
                    </div>
                    {/* Arrow pointing down */}
                    <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-1">
                      <div className="border-8 border-transparent border-t-gray-300"></div>
                      <div className="border-8 border-transparent border-t-white absolute top-0 left-1/2 -translate-x-1/2 -mt-px"></div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Upcoming Events List */}
        <div className="border-t border-[#E2E4F0] pt-4">
          <h4 className="font-semibold text-black mb-3 text-sm">Upcoming Events</h4>
          {loading ? (
            <div className="text-sm text-black/60 text-center py-4">
              Loading events...
            </div>
          ) : events.length === 0 ? (
            <div className="text-sm text-black/60 text-center py-4">
              No upcoming events
            </div>
          ) : (
            <div className="space-y-2">
              {events.slice(0, 5).map((event) => (
                <ProjectEventCard key={event.id} event={event} compact />
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
