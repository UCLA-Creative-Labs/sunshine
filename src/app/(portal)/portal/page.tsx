// Dashboard/Home page for the membership portal
// Route: /portal

import AnnouncementsSection from "@/components/portal/dashboard/AnnouncementsSection";
import CurrentProjectSection from "@/components/portal/dashboard/CurrentProjectSection";
import CalendarSection from "@/components/portal/dashboard/CalendarSection";
import TodoListSection from "@/components/portal/dashboard/TodoListSection";

export default function PortalDashboard() {
    return (
        <div className="flex-1 text-black px-6 py-8 md:px-10 md:py-10">
            <div className="mx-auto max-w-6xl space-y-8">
                {/* Announcements - full width */}
                <AnnouncementsSection />

                {/* Current Project - full width */}
                <CurrentProjectSection />

                {/* Calendar and Todo List - side by side on larger screens */}
                <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-8">
                    <CalendarSection />
                    <TodoListSection />
                </div>
            </div>
        </div>
    );
}
