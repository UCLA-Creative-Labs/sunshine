"use client"
import { useState, useEffect } from 'react';
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";

import QuarterProjectCard from "../QuarterProjectCard";
import "../../../styles/QuarterProjectCard.scss";
import { useParams } from "next/navigation";
import QuarterProjectCardList from '../QuarterProjectCardList';

import { getProjectsByYear } from '@/lib/supabase/projectService';
import { Project } from '@/types/project';

export default function About() {

  const { year } = useParams<{ year: string }>();
  const [start, end] = year.split("-");
  const formattedYear = `20${start}-20${end}`;

  const [projects, setProjects] = useState<Project[]>([]);

  useEffect(() => {
    if (year) {
      getProjectsByYear(year).then(setProjects);
    }
  }, [year]);

  const fallProjects = projects.filter(p => p.quarter.toLowerCase() === 'fall');
  const winterProjects = projects.filter(p => p.quarter.toLowerCase() === 'winter');
  const springProjects = projects.filter(p => p.quarter.toLowerCase() === 'spring');

  const [fExpand, setFExpand] = useState(false);
  const [wExpand, setWExpand] = useState(false);
  const [sExpand, setSExpand] = useState(false);
  return (
    <main className="flex min-h-screen flex-col">
      <Navbar />

      <div className="grow flex flex-col space-y-5 px-20 py-20 text-black min-w-full pc">
        <h2 className="text-4xl font-extrabold mb-2 text-black">
          PROJECTS: {formattedYear}
        </h2>
        <p className="text-xl mb-2 text-black">
          Click on each quarter to expand the section and browse the quarter’s
          super cool projects!
        </p>

        <div className="relative flex flex-col w-full">
          {fallProjects.length > 0 && (
            <>
              <QuarterProjectCard year={year} quarter="fall" onClick={() => setFExpand(!fExpand)} />
              {fExpand && <QuarterProjectCardList projects={fallProjects} />}
            </>
          )}

          {winterProjects.length > 0 && (
            <>
              <QuarterProjectCard year={year} quarter="winter" onClick={() => setWExpand(!wExpand)} />
              {wExpand && <QuarterProjectCardList projects={winterProjects} />}
            </>
          )}

          {springProjects.length > 0 && (
            <>
              <QuarterProjectCard year={year} quarter="spring" onClick={() => setSExpand(!sExpand)} />
              {sExpand && <QuarterProjectCardList projects={springProjects} />}
            </>
          )}
        </div>

      </div>
      <Footer />
    </main>
  );
}
