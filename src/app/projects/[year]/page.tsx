"use client"
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import ContentSection from "@/components/ContentSection";

import QuarterProjectCard from "../QuarterProjectCard";
import "../../../styles/QuarterProjectCard.scss";

import { useParams } from "next/navigation";

export default function About() {

  const { year } = useParams<{ year: string }>();
  const [start, end] = year.split("-");
  const formattedYear = `20${start}-20${end}`;
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
          <QuarterProjectCard year={year} quarter="fall" />
          <QuarterProjectCard year={year} quarter="winter" />
          <QuarterProjectCard year={year} quarter="spring" />
        </div>
      </div>

      <Footer />
    </main>
  );
}