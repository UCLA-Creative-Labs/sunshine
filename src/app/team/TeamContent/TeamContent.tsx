"use client";
import DropdownMenu from "@/components/DropdownMenu";
import Image from "next/image";
import { useEffect, useState } from "react";

function MemberCard({ memberData, className } : { memberData: any, className?: string }) {
  const { name, year, titles, degree, fact } = memberData;
  const photoURL = memberData?.photo?.fields?.file?.url;
  return (
    <div className={`group space-y-2 text-center md:text-start ${className}`}>
      <div className="w-250px aspect-square overflow-hidden shadow-lg rounded-lg">
        {photoURL && 
          <img 
            className="group-hover:scale-110 transition ease-in-out delay-50 duration-300 object-cover w-full h-full" 
            src={photoURL}
            alt={`Photo of ${name}`}
          />
        }
      </div>
      <div className="mx-2 space-y-1">
        <h1 className="text-xl md:text-2xl font-bold group-hover:text-blue-400 group-hover:drop-shadow-2xl transition ease-in-out delay-50 duration-300">{name}</h1>
        <h1 className="text-md text-neutral-500">{year ? 'CLASS OF ' + year : ''}</h1>
        <ul>
          {titles && titles.map((roleName, idx) => <li key={idx} className="text-md">{'\u2043' + ' '}{roleName}</li>)}
          {degree && <li className="text-md">{'\u2043'} Major: {degree}</li>}
          {fact && <li className="text-md">{'\u2043'} Fun Fact: {fact}</li>}
        </ul>
      </div>
    </div>
  )
}

export default function TeamContent({ members }: { members: Array<any> }) {
  const [membersList, setMembersList] = useState<Array<any>|undefined>(undefined);
  const [year, setYear] = useState<string>("All Years");
  const [role, setRole] = useState<string>("All Roles");

  useEffect(() => {
    setMembersList(members);
  }, [members]);

  useEffect(() => {
    if (membersList) {
      let newMembersList: Array<any> = [];
      for (const member of members) {
        if ((year == "All Years" || member.fields.year == year) &&
            (role == "All Roles" || member.fields.roles.includes(role))
        ) {
          newMembersList.push(member);
        }
      }
      setMembersList(newMembersList);
    }
  }, [year, role]);

  return (
  <div className="flex flex-col items-center lg:items-start lg:flex-row w-full my-12 text-black">
    <div className="flex flex-col space-y-8 items-center text-black w-1/2 md:w-1/4 ml-5">
      <h1 className="text-4xl font-bold">THE TEAM</h1>
      <div className="flex flex-col space-y-4 md:space-y-0 md:flex-row md:space-x-8 lg:space-x-0 lg:flex-col lg:space-y-2">
        <DropdownMenu
          className="flex flex-col w-[200px] text-xl"
          buttonClassName="p-4 px-4 bg-white border border-gray-300 border-[1.5px] focus:border-blue-300" 
          menuClassName="w-[200px] bg-white mt-1 text-center drop-shadow-md"
          menuButtonClassName="py-2 hover:bg-blue-200 border border-[1.5px] border-b-0 border-gray"
          menuButtonHoverColor="bg-blue-100"
          options={["All Years", "2025", "2026", "2027", "2028"]}
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
    <div className="p-12 grid gap-12 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 md:gap-8 lg:gap-12 xl:gap-16">
      { membersList?.filter((data) => data.enabled).map((data, idx) => 
        {
          const memberData = data.fields;
          return <MemberCard
            key={idx}
            memberData={memberData}
          />
        }
      )}
    </div>
    <div></div>
  </div>
  )
}