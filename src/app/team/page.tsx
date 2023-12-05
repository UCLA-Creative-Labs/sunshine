import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import { getDocsByType } from "@/lib/contentfulLib";
import React, { useState, useEffect } from "react";
import TeamContent from "./TeamContent/TeamContent";

const ROLES_SORTING = [
  "President",
  "Director",
  "Design",
  "Marketing/External",
  "Projects",
  "Finance",
  "Tech"
]

function memberSort(x, y) {
  const x_roles = x.fields?.roles;
  const y_roles = y.fields?.roles;
  if (!x_roles || !y_roles) return 0;
  if (ROLES_SORTING.indexOf(x_roles[0]) < ROLES_SORTING.indexOf(y_roles[0]))
    return -1;
  else if (ROLES_SORTING.indexOf(x_roles[0]) > ROLES_SORTING.indexOf(y_roles[0]))
    return 1;
  else {
    if (ROLES_SORTING.indexOf(x_roles[1]) != ROLES_SORTING.indexOf(y_roles[1])) {
      if (ROLES_SORTING.indexOf(x_roles[1]) < ROLES_SORTING.indexOf(y_roles[1]))
        return -1;
      else if (ROLES_SORTING.indexOf(x_roles[1]) > ROLES_SORTING.indexOf(y_roles[1]))
        return 1;
      }
      const x_name = x?.fields?.name;
      const y_name = y?.fields?.name;
    
      if (!x_name || !y_name)
        return 0;
      if (x_name > y_name)
        return 1;
      else if (x_name < y_name)
        return -1;
      else
        return 0;
    }
}

export default async function Team() {
  const members = await getDocsByType('member')
    .then(docs => {
      docs.sort(memberSort);
      docs = docs.map(obj => ({...obj, enabled: true}));
      return docs;
    });

  return (
    <main className="flex min-h-screen flex-col">
      <Navbar />
      <TeamContent members={members} />
      <Footer />
    </main>
  );
}
