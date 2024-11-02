// app/projects/[season]/page.tsx
"use client";

import React from 'react';
import { useParams } from 'next/navigation';
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import ContentSection from "@/components/ContentSection";
import {seasonData} from '@/assets/projectData';


const SeasonProjectPage = () => {
  const { season } = useParams(); // Get the 'season' parameter from the URL

  const currentSeason = seasonData.find((data) => data.url.endsWith(season));

  return (
    <main className="flex min-h-screen flex-col">
      <Navbar />
      <div className="grow flex flex-col space-y-10 px-20 py-20 text-black min-w-full pc">
        {currentSeason ? (
            <ContentSection title={currentSeason.title}>
                <div>
                <h1>hhhh</h1>
                <p>Details about the {season} season projects go here.</p>
                {/* Add more content, project lists, etc., as needed */}
                </div>
            </ContentSection>
        ) : (
            <h1>Season not found.</h1>
        )}
      </div>
      <Footer />
    </main>
  );
};

export default SeasonProjectPage;
