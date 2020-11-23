import React from 'react';

import '../styles/Team.scss';

interface Person {
  name: string;
  class: number;
  roles: string[];
  image?: string;
}

interface TeamCardProps {
  data: Person;
}

function TeamCard(props: TeamCardProps): JSX.Element {
  // TODO: move this and the alumni vs class of comparison to TeamPage
  const year = new Date().getFullYear();

  return (
    <div>
      <img className="team-img" src={props.data.image} alt={props.data.name} />
      <h4>{props.data.name}</h4>
      <p>{props.data.class < year ? 'ALUMNI' : `CLASS OF ${year}`}</p>
      {props.data.roles.map((role) => (
        <p key={props.data.name + '_' + role}>— {role}</p>
      ))}
    </div>
  );
}

export default TeamCard;
