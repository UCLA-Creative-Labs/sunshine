import ContentSection from "@/components/ContentSection";
import ProjectCard from "./ProjectCard";

import '../../styles/ProjectsContent.scss';


export default function ProjectsContent() {
    return (
        <div className="grow flex flex-col space-y-10 px-20 py-20 text-black min-w-full pc">
            <img src="/projects/header.png"></img>
            <ContentSection title="">
                <div className="flex flex-col w-full">
                    <div className="proj-container w-full">
                        {/*TODO: Can and probably should replace this with a db... i will do this later -AZ*/}
                        <ProjectCard title="Spring 2024" description="Featured Projects:" 
                        img="/projects/comingsoon.png" alt="coming soon!" url="projects/s24"/>
                        <ProjectCard title="Winter 2024" description="Featured Projects:" 
                        img="/projects/comingsoon.png" alt="coming soon!" url="projects/w24"/>
                        <ProjectCard title="Fall 2023" description="Featured Projects:" 
                        img="/projects/comingsoon.png" alt="coming soon!" url="projects/f23"/>
                        
                        <ProjectCard title="Spring 2023" description="Featured Projects:" 
                        img="/projects/comingsoon.png" alt="coming soon!" url="projects/s23"/>
                        <ProjectCard title="Winter 2023" description="Featured Projects:" 
                        img="/projects/comingsoon.png" alt="coming soon!" url="projects/w23"/>
                        <ProjectCard title="Fall 2022" description="Featured Projects:" 
                        img="/projects/comingsoon.png" alt="coming soon!" url="projects/f22"/>
                        
                        <ProjectCard title="Spring 2022" description="Featured Projects:" 
                        img="/projects/comingsoon.png" alt="coming soon!" url="projects/s22"/>
                        <ProjectCard title="Winter 2022" description="Featured Projects:" 
                        img="/projects/comingsoon.png" alt="coming soon!" url="projects/w22"/>
                        <ProjectCard title="Fall 2021" description="Featured Projects:" 
                        img="/projects/comingsoon.png" alt="coming soon!" url="projects/f21"/>
                        
                        <ProjectCard title="Spring 2021" description="Featured Projects:" 
                        img="/projects/comingsoon.png" alt="coming soon!" url="projects/s21"/>
                        <ProjectCard title="Winter 2021" description="Featured Projects:" 
                        img="/projects/comingsoon.png" alt="coming soon!" url="projects/w21"/>
                        <ProjectCard title="Fall 2020" description="Featured Projects:" 
                        img="/projects/comingsoon.png" alt="coming soon!" url="projects/f20"/>
                        
                        <ProjectCard title="Spring 2020" description="Featured Projects:" 
                        img="/projects/comingsoon.png" alt="coming soon!" url="projects/s20"/>
                        <ProjectCard title="Winter 2020" description="Featured Projects:" 
                        img="/projects/comingsoon.png" alt="coming soon!" url="projects/w20"/>
                        <ProjectCard title="Fall 2019" description="Featured Projects:" 
                        img="/projects/comingsoon.png" alt="coming soon!" url="projects/f19"/>

                    </div>
                </div>
            </ContentSection>
        </div>
    )
}