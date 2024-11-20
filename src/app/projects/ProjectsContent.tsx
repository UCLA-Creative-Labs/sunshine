'use client';

import ContentSection from '@/components/ContentSection';
import ProjectCard from './ProjectCard';
import { useRouter } from 'next/navigation';
import projectData from '@/assets/projectData';

import '../../styles/ProjectsContent.scss';

export default function ProjectsContent() {
    const router = useRouter();

    const handleNavigation = (path: string) => {
        router.push(path);
    };

    return (
        <div className="grow flex flex-col space-y-10 px-20 py-20 text-black min-w-full pc">
            <img
                src="/projects/header.png"
                alt="Creative Labs Project Archive"
            ></img>
            <ContentSection title="">
                <div className="relative flex flex-col w-full">
                    <div className="proj-container w-full">
                        {projectData.map((project, index) => (
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
    );
}
