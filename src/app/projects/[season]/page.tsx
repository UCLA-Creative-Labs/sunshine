// app/projects/[season]/page.tsx
"use client";

import React from 'react';
import { useParams } from 'next/navigation';
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";

const SeasonProjectPage = () => {
  const { season } = useParams(); // Get the 'season' parameter from the URL

  // Placeholder data - replace this with actual data or a data fetching function
  const seasonData = {
    s24: 'Spring 2024 Projects',
    f24: 'Fall 2024 Projects',
    w24: 'Winter 2024 Projects',
    // Add other seasons as needed
  };

  return (
    <main className="flex min-h-screen flex-col">
      <Navbar />
      <div>
      <h1>{seasonData[season as keyof typeof seasonData] || 'Projects'}</h1>
      <p>Details about the {season} season projects go here.</p>
      {/* Add more content, project lists, etc., as needed */}
      </div>
      <Footer />
    </main>
  );
};

export default SeasonProjectPage;
