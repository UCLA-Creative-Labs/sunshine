"use client";

import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import TeampageContent from "./TeampageContent";
import { getBoardMembers } from "../../lib/boardMembers";
import React, { useState, useEffect } from "react";

interface Person {
  name: string;
  class: number;
  roles: string[];
  image?: string;
  link?: string;
}

export default function Team(): JSX.Element {
  const [team, setTeam] = useState<Person[]>([]);
  getBoardMembers()
    .then((data) => {
      if (data && Array.isArray(data)) {
        // Assuming 'data' is an array of team member entries
        const updatedData = data.map((entry) => {
          const fields = entry.fields;
          return {
            name: fields.name || "Unknown Name",
            class: fields.class || 0,
            roles: fields.roles || [],
            image: fields.imageURL ? fields.imageURL : "/card_icons/winter.svg",
            link: fields.website || fields.github || fields.instagram || "",
          };
        });

        setTeam(updatedData);
      } else {
        console.error("Data structure is missing expected properties");
      }
    })
    .catch((error) => {
      console.error("Error fetching team members:", error);
    });

  return (
    <main className="flex min-h-screen flex-col">
      <Navbar />
      <TeampageContent data={team} />
      <Footer />
    </main>
  );
}
