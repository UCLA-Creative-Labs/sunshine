import React, { useState } from 'react';
import Select from 'react-select';

import TeamCard from './TeamCard';

interface Person {
  name: string;
  class: string;
  roles: string[];
  image?: string;
}

interface TeamProps {
  data: Person[];
}

const roles = ['All Roles', 'Designer', 'Developer', 'Director', 'External', 'Projects'];
const roleOptions = roles.map(item => ({ value: item, label: item }));

const currYear = new Date().getFullYear();
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

  // if there's no image, use 'winter.svg'
  props.data.forEach(
    (data) =>
      (data.image && data.image.indexOf('/assets/') == -1
        ? (data.image = `/assets/${data.image}`)
        : data.image) || (data.image = '/assets/winter.svg'));

  let filteredData = props.data;

  if (year.value !== 'All Years') {
    if (year.value === 'Alumni') {
      filteredData = filteredData.filter((person) => +person.class <= currYear);
    }
    else {
      filteredData = filteredData.filter((person) => +person.class === +year.value);
    }
  }

  if (role.value !== 'All Roles') {
    filteredData = filteredData.filter((person) => person.roles.includes(role.value));
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
