import React from 'react';
import Select from 'react-select';

import TeamCard from './TeamCard';

interface Person {
  name: string;
  class: number;
  roles: string[];
  image?: string;
}

interface TeamProps {
  data: Person[];
}

const roles = ['Designer', 'Developer', 'Director', 'External', 'Projects'];
const roleOptions = roles.map(item => ({ value: item.toLowerCase(), label: item }));

const year = new Date().getFullYear();
const yearOptions = [year + 1, year + 2, year + 3, year + 4, 'Alumni'].map(item => ({ value: item, label: item }));

function Team(props: TeamProps): JSX.Element {
  props.data.forEach((data) => data.image && data.image.indexOf('/assets/') == -1 ? (data.image = `/assets/${data.image}`) : data.image);

  return (
    <div className="team-page">
      <h1>THE TEAM</h1>
      <div className="team-content">
        <div className="team-left">
          <Select className='team-select' placeholder='Year' options={yearOptions} />
          <Select className='team-select' placeholder='Role' options={roleOptions} />
        </div>
        <div className="team-cards">
          {props.data.map((person) => (
            <TeamCard key={person.name} data={person} />
          ))}
        </div>
      </div>
    </div>
  );
}

export default Team;
