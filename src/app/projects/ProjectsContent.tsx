import ContentSection from "@/components/ContentSection";
import ProjectCard from "./ProjectCard";

import '../../styles/ProjectsContent.scss';


export default function ProjectsContent() {
    return (
        <div className="grow flex flex-col space-y-10 px-20 py-20 text-black min-w-full">
            <img src="/projects/header.png"></img>
            <ContentSection title="PROJECTS ARCHIVE">
                <div className="flex flex-col w-full">
                    <div className="proj-container w-full">
                        <ProjectCard title="Fall 2023" description="Featured Projects:" img="/projects/comingsoon.png"/>
                        <ProjectCard title="Fall 2023" description="Featured Projects:" img="/projects/comingsoon.png"/>
                        <ProjectCard title="Fall 2023" description="Featured Projects:" img="/projects/comingsoon.png"/>
                        <ProjectCard title="Fall 2023" description="Featured Projects:" img="/projects/comingsoon.png"/>
                        <ProjectCard title="Fall 2023" description="Featured Projects:" img="/projects/comingsoon.png"/>

                    </div>
                </div>
            </ContentSection>
        </div>
    )
}