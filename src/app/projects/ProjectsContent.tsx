"use client";
import ContentSection from "@/components/ContentSection";
import YearProjectCard from "./YearProjectCard";
import projectData from '@/assets/projectData';
import { useRouter } from "next/navigation";

import '../../styles/ProjectsContent.scss';


export default function ProjectsContent() {

    const router = useRouter();

    const goToYearPage = (year: string) => {
        router.push("/projects/" + year);
    };
    return (
      <div className="grow flex flex-col space-y-5 px-20 py-20 text-black min-w-full pc">
        <h2 className="text-5xl font-extrabold mb-2">RECENT PROJECTS</h2>
        <p className="text-2xl mb-2">
          Every quarter, we have student teams collaborate and execute any
          creative idea. Here, we’ve archived all previous projects for you to
          browse and enjoy! If you’re inspired to create a project of your own,
          learn more HERE!
        </p>

        <ContentSection title="">
          <div className="relative flex flex-col w-full">
            <div className="proj-container w-full">
              {projectData.map((project, index) => (
                <button
                  key={index}
                  onClick={() => router.push(project.url)}
                  className="w-full text-left"
                >
                  <YearProjectCard
                    key={index}
                    title={project.title}
                    description={project.description}
                    img={project.img}
                    alt={project.alt}
                    url={project.url}
                  />
                </button>
              ))}
            </div>
          </div>
        </ContentSection>
      </div>
    );
}
