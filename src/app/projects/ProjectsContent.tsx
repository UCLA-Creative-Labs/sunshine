import ContentSection from "@/components/ContentSection";
import ProjectCard from "./ProjectCard";
import {seasonData} from '@/assets/projectData';

import '../../styles/ProjectSeasonContent.scss';


export default function ProjectsContent() {
    return (
        <div className="grow flex flex-col space-y-10 px-20 py-20 text-black min-w-full pc">
            <img src="/projects/header.png" alt="Creative Labs Project Archive"></img>
            <ContentSection title="">
                <div className="relative flex flex-col w-full">
                    <div className="proj-container w-full">
                        {seasonData.map((project, index) => (
                            <ProjectCard
                            key={index}
                            title={project.title}
                            description={project.description}
                            img={project.img}
                            alt={project.alt}
                            url={project.url}
                            />
                        ))}
                    </div>
                </div>
            </ContentSection>
        </div>
    )
}