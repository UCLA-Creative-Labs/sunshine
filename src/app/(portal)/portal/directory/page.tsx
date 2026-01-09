// Directory page for the membership portal
// Route: /portal/directory
import ProjectsDirectory from "@/components/portal/directory/ProjectsDirectory";

export default function PortalDirectory() {
    return (
        <div className="flex-1 text-black px-6 py-8 md:px-10 md:py-10">
            <div className="mx-auto max-w-6xl">
                <ProjectsDirectory />
            </div>
        </div>
    );
}
