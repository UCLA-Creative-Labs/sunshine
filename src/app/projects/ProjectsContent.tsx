import ContentSection from "@/components/ContentSection";
import ProjectCard from "./ProjectCard";

export default function ProjectsContent() {
    return (
        <div className="grow flex flex-col space-y-10 px-20 py-20 text-black min-w-full">
            <ContentSection title="PROJECTS ARCHIVE">
                <div className="flex flex-col">
                    <h1 className="text-lg">
                        Every quarter, we have student teams collaborate and execute an idea. Below are some projects that were created in the past quarters. Feel free to browse!
                    </h1>
                    <h1 className="text-lg font-bold">
                        Currently, work in progress...
                    </h1>
                    {/* <div>
                        <ProjectCard title="Fall 2023" description="Featured Projects:" url=""/>
                    </div> */}
                </div>
            </ContentSection>
        </div>
    )
}