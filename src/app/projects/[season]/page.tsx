// app/projects/[season]/page.tsx
"use client";

import React from 'react';
import { useParams } from 'next/navigation';
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import ProjectsContent from "./ProjectsContent";
import { projData , seasonData } from '@/assets/projectData';

const SeasonProjectPage = () => {
  const { season } = useParams(); // Get the 'season' parameter from the URL

  const seasonParam = Array.isArray(season) ? season[0] : season;
  const currentSeason = seasonData.find((data) => data.url.endsWith(seasonParam));
  const currentSeasonProjects = projData.filter((project) => project.season === seasonParam);

  return (    
    <main className="flex min-h-screen flex-col">
      <Navbar />
      <div className="grow flex flex-col space-y-10 px-20 py-10 text-black min-w-full pc">
        <h1 style={{ fontSize: '2rem', fontWeight: 'bold' }}>
            Projects- {currentSeason?.title}
        </h1>
        {currentSeasonProjects.length > 0 ? (
          currentSeasonProjects.map((project, index) => (
            <ProjectsContent
            key={index}
            title={project.title}
            description={project.description}
            instaGraphic={project.insta_graphic}
            projectLeads={project.pLeads}
            projectMembers={project.pMembers}
            url={project.url}
            />
          ))
        ) : (
          <h1>No projects found for this season.</h1>
        )}
      </div>
      <Footer />
    </main>
  );
};

export default SeasonProjectPage;
