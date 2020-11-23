import React from 'react';

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

function Team(props: TeamProps): JSX.Element {
  props.data.forEach((data) => data.image && data.image.indexOf('/assets/') == -1 ? (data.image = `/assets/${data.image}`) : data.image);

  return (
    <div>
      <h1>THE TEAM</h1>
      <div className="team-left">
        <select>
          <option>Designer</option>
          <option>Developer</option>
        </select>
      </div>
      <div className="section">
        {props.data.map((person) => (
          <TeamCard key={person.name} data={person} />
        ))}
      </div>
    </div>
  );
}

export default Team;
