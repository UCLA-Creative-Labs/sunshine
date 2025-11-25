// Directory page for the membership portal
// Route: /portal/directory
import ProjectsDirectory from "@/components/portal/directory/ProjectsDirectory";

export default function PortalDirectory() {
    return (
        <div className="p-8 text-black">
                <ProjectsDirectory />
        </div>
    );
}
