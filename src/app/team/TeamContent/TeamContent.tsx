'use client'
import DropdownMenu from "@/components/DropdownMenu";
import ToolTip from "@/components/ToolTip";
import { useState } from "react";

function MemberCard({ memberData, alumni, className } : { memberData: any, alumni: boolean, className?: string }) {
  const { name, year, titles, degree, fact, company, website} = memberData;
  // Use default avatar for all members (professional headshots coming soon)
  const photoURL = '/images/default-avatar.svg';

  return (
    <div className={`group space-y-2 text-center md:text-start ${className}`}>
      <div className="max-w-[250px] aspect-square overflow-hidden shadow-lg rounded-lg">
        
        {website ? (
          <ToolTip content={<span className="break-all">{website} <span className="ml-1">↗</span> </span>}>
            <div className="w-full h-full">
              {photoURL && 
                <img 
                  className="group-hover:scale-110 transition ease-in-out delay-50 duration-300 object-cover w-full h-full cursor-pointer" 
                  src={photoURL}
                  alt={`Photo of ${name}`}
                  onClick={() => window.open(website, "_blank", "noopener,noreferrer")}
                />
              }
            </div>
          </ToolTip>
        ) : (
          <div className="w-full h-full">
            {photoURL && 
              <img 
                className="object-cover w-full h-full" 
                src={photoURL}
                alt={`Photo of ${name}`}
              />
            }
          </div>
        )}
      </div>

      <div className="mx-2 space-y-1">
        <h1 className="text-xl md:text-2xl font-bold group-hover:text-blue-400 group-hover:drop-shadow-2xl transition ease-in-out delay-50 duration-300">
          {name}
        </h1>
        <h1 className="text-md text-neutral-500">{year ? 'CLASS OF ' + year : ''}</h1>
        <ul>
          {titles && titles.map((roleName, idx) => <li key={idx} className="text-md">{'\u2043' + ' '}{roleName}</li>)}
          {!alumni && degree && <li className="text-md">{'\u2043'} Major: {degree}</li>}
          {!alumni && fact && <li className="text-md">{'\u2043'} Fun Fact: {fact}</li>}
          {alumni && company && <li className="text-md">{'\u2043'} Now at: {company}</li>}
        </ul>
      </div>
    </div>
  );
}


// Team order for display
const TEAM_ORDER = [
  'President',
  'Senior Advisor',
  'Design',
  'Marketing/External',
  'Projects',
  'Finance',
  'Tech'
];

export default function TeamContent({ members, alumni }: { members: Array<any>, alumni: Array<any> }) {
  const [year, setYear] = useState<string>("All Years");
  const [role, setRole] = useState<string>("All Roles");

  // Filter members by year and role
  const filteredMembers = members.filter((member) => {
    const matchYear = year === "All Years" || member.fields.year == year;
    const matchRole = role === "All Roles" || member.fields.roles?.includes(role);
    return matchYear && matchRole && member.enabled;
  });

  // Group members by their primary team
  const groupedMembers = TEAM_ORDER.map(team => {
    const teamMembers = filteredMembers.filter(member => {
      const roles = member.fields.roles || [];

      // For President section: people who are ONLY Directors (Exec role → Director in Contentful)
      if (team === 'President') {
        return roles.length === 1 && roles[0] === 'Director';
      }

      // For Senior Advisor section: people with Senior Advisor role
      if (team === 'Senior Advisor') {
        return roles.includes('Senior Advisor');
      }

      // For other teams, check if team name is in their roles (handles both ['Director', 'Team'] and ['Team', 'Director'])
      return roles.includes(team);
    });

    // Sort: Directors first (for team sections), then alphabetically
    teamMembers.sort((a, b) => {
      const aIsDirector = a.fields.roles?.includes('Director');
      const bIsDirector = b.fields.roles?.includes('Director');

      if (aIsDirector && !bIsDirector) return -1;
      if (!aIsDirector && bIsDirector) return 1;

      // Alphabetically by name
      const aName = a.fields.name || '';
      const bName = b.fields.name || '';
      return aName.localeCompare(bName);
    });

    // Change "President" to "Co-Presidents" if there are 2+ members
    let displayName = team;
    if (team === 'President' && teamMembers.length > 1) {
      displayName = 'Co-Presidents';
    }

    return { team: displayName, members: teamMembers };
  }).filter(group => group.members.length > 0); // Only show teams with members

  return (
    <div className="flex flex-col items-center w-full my-12 text-black">
      {/* Header and Filters - Original Layout */}
      <div className="flex flex-col items-center lg:items-start lg:flex-row w-full my-12">
        <div className="flex flex-col space-y-8 items-center text-black w-1/2 md:w-1/4 ml-5">
          <h1 className="text-4xl font-bold">THE TEAM</h1>
          <div className="flex flex-col space-y-4 md:space-y-0 md:flex-row md:space-x-8 lg:space-x-0 lg:flex-col lg:space-y-2">
            <DropdownMenu
              className="flex flex-col w-[200px] text-xl"
              buttonClassName="p-4 px-4 bg-white border border-gray-300 border-[1.5px] focus:border-blue-300"
              menuClassName="w-[200px] bg-white mt-1 text-center drop-shadow-md"
              menuButtonClassName="py-2 hover:bg-blue-200 border border-[1.5px] border-b-0 border-gray"
              menuButtonHoverColor="bg-blue-100"
              options={["All Years", "2025", "2026", "2027", "2028", "2029"]}
              setValue={setYear}
            />
            <DropdownMenu
              className="flex flex-col w-[200px] text-xl"
              buttonClassName="p-4 px-4 bg-white border border-gray-300 border-[1.5px] focus:border-blue-300"
              menuClassName="w-[200px] bg-white mt-1 text-center drop-shadow-md"
              menuButtonClassName="py-2 hover:bg-blue-200 border border-[1.5px] border-b-0 border-gray"
              menuButtonHoverColor="bg-blue-100"
              options={["All Roles", "President", "Director", "Design", "Marketing/External", "Projects", "Finance", "Tech"]}
              setValue={setRole}
            />
          </div>
        </div>

        {/* Team Sections */}
        <div className="flex-1 w-full px-8">
          {groupedMembers.map((group, groupIdx) => (
            <div key={groupIdx} className="mb-16">
              {/* Team Header - Black text, simple style */}
              <h2 className="text-3xl font-bold text-black mb-8">
                {group.team}
              </h2>

              {/* Team Members Grid */}
              <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {group.members.map((data, idx) => (
                  <MemberCard
                    key={idx}
                    memberData={data.fields}
                    alumni={false}
                  />
                ))}
              </div>
            </div>
          ))}

          {/* No results message */}
          {groupedMembers.length === 0 && (
            <div className="text-center py-12">
              <p className="text-2xl text-gray-500">No members match the selected filters.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
