import React, { CSSProperties, useState } from "react";
import Select from "react-select";
import TeamCard from "@/components/TeamCard";
import TeampageSection from "./TeampageSection";

interface Person {
  name: string;
  class: number;
  roles: string[];
  image?: string;
  link?: string;
}

interface TeamProps {
  data: Person[];
}

interface SelectOption {
  value: string;
  label: string;
}

const roles = [
  "All Roles",
  "Designer",
  "Developer",
  "Director",
  "External",
  "Projects",
];

const roles_index = [
  "Executive Director",
  "Design Director",
  "External Director",
  "Projects Director",
  "Tech Director",
  "Designer",
  "Developer",
  "External",
  "Projects",
];

const roleOptions = roles.map((item) => ({ value: item, label: item }));

const currYear = Math.floor(
  new Date().getFullYear() + (new Date().getMonth() - 5) / 12
);

const yearOptions = [
  "All Years",
  (currYear + 1).toString(),
  (currYear + 2).toString(),
  (currYear + 3).toString(),
  (currYear + 4).toString(),
].map((item) => ({ value: item, label: item }));

const alumniYears = ["All Years"];

for (let y = 2019; y <= currYear; y++) {
  alumniYears.push(y.toString());
}

const alumniYearOptions = alumniYears.map((item) => ({
  value: item,
  label: item,
}));

const selectStyles: any = {
  control: (provided: CSSProperties, _unused: any) => ({
    ...provided,
    borderRadius: "0",
    padding: "8px 4px 8px 8px",
  }),
  menu: (provided: CSSProperties, _unused: any) => ({
    ...provided,
    borderRadius: "0",
  }),
  dropdownIndicator: (provided: CSSProperties, _unused: any) => ({
    ...provided,
    color: "black",
  }),
  indicatorSeparator: (provided: CSSProperties, _unused: any) => ({
    ...provided,
    display: "none",
  }),
};

export default function TeampageContent(props: TeamProps): JSX.Element {
  const [year, setYear] = useState<SelectOption | null>(null);
  const [role, setRole] = useState<SelectOption | null>(null);
  const [alumniYear, setAlumniYear] = useState<SelectOption | null>(null);
  const [alumniRole, setAlumniRole] = useState<SelectOption | null>(null);

  const filteredData = props.data.filter((person) => {
    const isPersonValid = person.class && person.name && person.roles;
    if (!isPersonValid) {
      console.log("Invalid person:", person);
    }
    return isPersonValid;
  });

  filteredData.forEach((person) =>
    person.roles.sort((a, b) => roles_index.indexOf(a) - roles_index.indexOf(b))
  );

  let currentMembers = filteredData.filter((person) => person.class > currYear);
  let alumni = filteredData.filter((person) => person.class <= currYear);

  function memberSortHelper(a: Person, b: Person) {
    const min_a = Math.min(...a.roles.map((r) => roles_index.indexOf(r)));
    const min_b = Math.min(...b.roles.map((r) => roles_index.indexOf(r)));

    return min_a - min_b || (a.name < b.name ? -1 : 1);
  }

  currentMembers.sort(memberSortHelper);
  alumni.sort(memberSortHelper);

  if (year && year.value !== "All Years") {
    currentMembers = currentMembers.filter(
      (person) => person.class === +year.value
    );
  }

  if (role && role.value !== "All Roles") {
    currentMembers = currentMembers.filter((person) =>
      person.roles.some((r) => r === role.value || r.includes(role.value))
    );
  }

  if (alumniYear && alumniYear.value !== "All Years") {
    alumni = alumni.filter((person) => person.class === +alumniYear.value);
  }

  if (alumniRole && alumniRole.value !== "All Roles") {
    alumni = alumni.filter((person) =>
      person.roles.some(
        (r) => r === alumniRole.value || r.includes(alumniRole.value)
      )
    );
  }

  return (
    <div className="mt-[#{$navbar-height}] bg-white p-24 text-black">
      <TeampageSection title="THE TEAM">
        <div className="flex">
          <div className="min-h-72 w-auto flex flex-col">
            <Select
              className="w-full sm:w-48 px-2 py-3 mt-3 sm:mt-0 sm:mr-16"
              styles={selectStyles}
              name="year"
              onChange={(selectedOption) => {
                setYear(selectedOption);
              }}
              value={year}
              placeholder="Year"
              options={yearOptions}
              isSearchable={false}
              aria-label="Filter by Year"
            />
            <Select
              className="w-full sm:w-48 px-2 py-3 mt-3 sm:mt-0 sm:mr-16"
              styles={selectStyles}
              name="role"
              onChange={(newValue) => {
                setRole(newValue);
              }}
              value={role}
              placeholder="Role"
              options={roleOptions}
              isSearchable={false}
              aria-label="Filter by Role"
            />
          </div>
          <div className="w-full grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 mt-4">
            {currentMembers.length
              ? currentMembers.map((person) => (
                  <TeamCard key={person.name} data={person} />
                ))
              : "No one was found."}
          </div>
        </div>
      </TeampageSection>
      <TeampageSection title="ALUMNI">
        <div className="flex">
          <div className="min-h-72 w-auto flex flex-col">
            <Select
              className="w-full sm:w-48 px-2 py-3 mt-3 sm:mt-0 sm:mr-16"
              styles={selectStyles}
              name="alumni-year"
              onChange={(newValue) => {
                setAlumniYear(newValue);
              }}
              value={alumniYear}
              placeholder="Year"
              options={alumniYearOptions}
              isSearchable={false}
              aria-label="Filter by Year"
            />
            <Select
              className="w-full sm:w-48 px-2 py-3 mt-3 sm:mt-0 sm:mr-16"
              styles={selectStyles}
              name="alumni-role"
              onChange={(newValue) => {
                setAlumniRole(newValue);
              }}
              value={alumniRole}
              placeholder="Role"
              options={roleOptions}
              isSearchable={false}
              aria-label="Filter by Role"
            />
          </div>
          <div className="w-full grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 mt-4">
            {alumni.length
              ? alumni.map((person) => <TeamCard data={person} />)
              : "No one was found."}
          </div>
        </div>
      </TeampageSection>
    </div>
  );
}
