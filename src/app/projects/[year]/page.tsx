"use client"
import { useState } from 'react';
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";

import QuarterProjectCard from "../QuarterProjectCard";
import "../../../styles/QuarterProjectCard.scss";
import { useParams } from "next/navigation";
import QuarterProjectCardList from '../QuarterProjectCardList';

import projectData from '@/assets/projectData';

export default function About() {

  const { year } = useParams<{ year: string }>();
  const [start, end] = year.split("-");
  const formattedYear = `20${start}-20${end}`;
  const yearlyProjects = projectData.find(proj => proj.year === year);
  const [fExpand, setFExpand] = useState(false);
  const [wExpand, setWExpand] = useState(false);
  const [sExpand, setSExpand] = useState(false);

console.log(fExpand);
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
          {yearlyProjects && yearlyProjects.projects.fall && (
            <QuarterProjectCard year={year} quarter="fall" onClick={() => setFExpand(!fExpand)} />
          )}
          {fExpand ? <QuarterProjectCardList quarter="fall" year={year} /> : <></>}
          {yearlyProjects && yearlyProjects.projects.winter && (
            <QuarterProjectCard year={year} quarter="winter" onClick={() => setWExpand(!wExpand)} />
          )}
          {wExpand ? <QuarterProjectCardList quarter="winter" year={year} /> : <></>}
          {yearlyProjects && yearlyProjects.projects.spring && (
            <QuarterProjectCard year={year} quarter="spring" onClick={() => setSExpand(!sExpand)} />
          )}
          {sExpand ? <QuarterProjectCardList quarter="spring" year={year} /> : <></>}
        </div>
      </div>

      <Footer />
    </main>
  );
}
