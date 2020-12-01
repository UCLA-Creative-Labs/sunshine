import React, { useState } from 'react';
import Select from 'react-select';
import TeamCard from './TeamCard';
import {Person, roles_index} from '../../utils/Utils';

interface TeamProps {
  data: Person[];
}

const roles = ['All Roles', 'Designer', 'Developer', 'Director', 'External', 'Projects'];
const roleOptions = roles.map(item => ({ value: item, label: item }));

// Set June to be the cut off day for the start of a new year
const currYear = Math.floor(new Date().getFullYear() + ((new Date().getMonth() - 5 ) / 12));
const yearOptions = ['All Years', currYear + 1, currYear + 2, currYear + 3, currYear + 4, 'Alumni'].map(item => ({ value: item, label: item }));

const selectStyles = {
  control: (provided, _) => ({
    ...provided,
    borderRadius: '0',
    padding: '8px 4px 8px 8px',
  }),
  menu: (provided, _) => ({
    ...provided,
    borderRadius: '0',
  }),
  dropdownIndicator: (provided, _) => ({
    ...provided,
    color: 'black',
  }),
  indicatorSeparator: (provided, _) => ({
    ...provided,
    display: 'none',
  }),
};

function Team(props: TeamProps): JSX.Element {
  const [year, setYear] = useState({ value: 'All Years', label: 'All Years' });
  const [role, setRole] = useState({ value: 'All Roles', label: 'All Roles' });

  let filteredData = props.data.filter((person) => person.class && person.name && person.roles);

  filteredData.forEach(person =>
    person.roles.sort((a, b) => roles_index.indexOf(a) - roles_index.indexOf(b)));

  filteredData = filteredData.filter((person) => person.class >= currYear);

  filteredData.sort((a, b) => {
    const isAlumni_a = a.class == currYear;
    const isAlumni_b = b.class == currYear;

    if (+isAlumni_a ^ +isAlumni_b && isAlumni_b) return -1; //eslint-disable-line no-bitwise
    if (+isAlumni_a ^ +isAlumni_b && isAlumni_a) return 1;  //eslint-disable-line no-bitwise

    const min_a = Math.min(...a.roles.map((r) => roles_index.indexOf(r)));
    const min_b = Math.min(...b.roles.map((r) => roles_index.indexOf(r)));

    return min_a - min_b || (a.name < b.name ? -1 : 1);
  });

  if (year.value !== 'All Years') {
    if (year.value === 'Alumni') {
      filteredData = filteredData.filter((person) => person.class <= currYear);
    }
    else {
      filteredData = filteredData.filter((person) => person.class === +year.value);
    }
  }

  if (role.value !== 'All Roles') {
    filteredData = filteredData.filter((person) =>
      person.roles.some((r) => r === role.value || r.includes(role.value)));
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
          {filteredData.length
            ? filteredData.map((person) => (
              <TeamCard
                key={person.name}
                data={person}
                alumni={person.class <= currYear}
              />
            ))
            : 'No one was found.'}
        </div>
      </div>
    </div>
  );
}

export default Team;
