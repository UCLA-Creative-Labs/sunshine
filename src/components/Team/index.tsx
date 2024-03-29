import React, { CSSProperties, useState } from 'react';
import Select from 'react-select';
import { Person, roles_index } from '../../utils/Utils';
import TeamCard from './TeamCard';

interface TeamProps {
  data: Person[];
}

const roles = [
  'All Roles',
  'Designer',
  'Developer',
  'Director',
  'External',
  'Projects',
];
const roleOptions = roles.map((item) => ({ value: item, label: item }));

// Set June to be the cut off day for the start of a new year
const currYear = Math.floor(
  new Date().getFullYear() + (new Date().getMonth() - 5) / 12,
);

const yearOptions = [
  'All Years',
  currYear + 1,
  currYear + 2,
  currYear + 3,
  currYear + 4,
].map((item) => ({ value: item, label: item }));

const alumniYears = ['All Years'];

for (let y = 2019; y <= currYear; y++) {
  alumniYears.push(y);
}

const alumniYearOptions = alumniYears.map((item) => ({
  value: item,
  label: item,
}));

const selectStyles = {
  control: (provided: CSSProperties, _) => ({
    ...provided,
    borderRadius: '0',
    padding: '8px 4px 8px 8px',
  }),
  menu: (provided: CSSProperties, _) => ({
    ...provided,
    borderRadius: '0',
  }),
  dropdownIndicator: (provided: CSSProperties, _) => ({
    ...provided,
    color: 'black',
  }),
  indicatorSeparator: (provided: CSSProperties, _) => ({
    ...provided,
    display: 'none',
  }),
};

function Team(props: TeamProps): JSX.Element {
  const [year, setYear] = useState({ value: 'All Years', label: 'All Years' });
  const [role, setRole] = useState({ value: 'All Roles', label: 'All Roles' });
  const [alumniYear, setAlumniYear] = useState({
    value: 'All Years',
    label: 'All Years',
  });
  const [alumniRole, setAlumniRole] = useState({
    value: 'All Roles',
    label: 'All Roles',
  });

  const filteredData = props.data.filter(
    (person) => person.class && person.name && person.roles,
  );

  filteredData.forEach((person) =>
    person.roles.sort(
      (a, b) => roles_index.indexOf(a) - roles_index.indexOf(b),
    ),
  );

  let currentMembers = filteredData.filter((person) => person.class > currYear);

  let alumni = filteredData.filter((person) => person.class <= currYear);

  function memberSortHelper(a, b) {
    const min_a = Math.min(...a.roles.map((r) => roles_index.indexOf(r)));
    const min_b = Math.min(...b.roles.map((r) => roles_index.indexOf(r)));

    return min_a - min_b || (a.name < b.name ? -1 : 1);
  }

  currentMembers.sort(memberSortHelper);
  alumni.sort(memberSortHelper);

  if (year.value !== 'All Years') {
    currentMembers = currentMembers.filter(
      (person) => person.class === +year.value,
    );
  }

  if (role.value !== 'All Roles') {
    currentMembers = currentMembers.filter((person) =>
      person.roles.some((r) => r === role.value || r.includes(role.value)),
    );
  }

  if (alumniYear.value !== 'All Years') {
    alumni = alumni.filter((person) => person.class === +alumniYear.value);
  }

  if (alumniRole.value !== 'All Roles') {
    alumni = alumni.filter((person) =>
      person.roles.some(
        (r) => r === role.value || r.includes(alumniRole.value),
      ),
    );
  }

  return (
    <div className="team-page">
      <h1>THE TEAM</h1>
      <div className="team-content">
        <div className="team-left">
          <Select
            className="team-select"
            styles={selectStyles}
            name="year"
            onChange={setYear}
            value={year}
            placeholder="Year"
            options={yearOptions}
            isSearchable={false}
            aria-label="Filter by Year"
          />
          <Select
            className="team-select"
            styles={selectStyles}
            name="role"
            onChange={setRole}
            value={role}
            placeholder="Role"
            options={roleOptions}
            isSearchable={false}
            aria-label="Filter by Role"
          />
        </div>
        <div className="team-cards">
          {currentMembers.length
            ? currentMembers.map((person) => (
              <TeamCard key={person.name} data={person} />
            ))
            : 'No one was found.'}
        </div>
      </div>
      <h1>ALUMNI</h1>
      <div className="team-content">
        <div className="team-left">
          <Select
            className="team-select"
            styles={selectStyles}
            name="alumni-year"
            onChange={setAlumniYear}
            value={alumniYear}
            placeholder="Year"
            options={alumniYearOptions}
            isSearchable={false}
            aria-label="Filter by Year"
          />
          <Select
            className="team-select"
            styles={selectStyles}
            name="alumni-role"
            onChange={setAlumniRole}
            value={alumniRole}
            placeholder="Role"
            options={roleOptions}
            isSearchable={false}
            aria-label="Filter by Role"
          />
        </div>
        <div className="team-cards">
          {alumni.length
            ? alumni.map((person) => (
              <TeamCard key={person.name} data={person} />
            ))
            : 'No one was found.'}
        </div>
      </div>
    </div>
  );
}

export default Team;
