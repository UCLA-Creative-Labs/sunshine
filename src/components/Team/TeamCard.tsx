import React from 'react';

import '../styles/Team.scss';

interface Person {
  name: string;
  class: number;
  roles: string[];
  image?: string;
  link?: string;
}

interface TeamCardProps {
  data: Person;
}

function TeamCard(props: TeamCardProps): JSX.Element {
  // TODO: move this and the alumni vs class of comparison to TeamPage
  const year = new Date().getFullYear();
  const image = <img className="team-img" src={props.data.image} alt={props.data.name} />;

  return (
    <div className="team-card">
      {props.data.link ? <a target="_blank" rel="noreferrer" href={props.data.link}> {image} </a> : image}
      <h3 className="team-title">{props.data.name}</h3>
      <p>{props.data.class < year ? 'ALUMNI' : `CLASS OF ${props.data.class}`}</p>
      {props.data.roles.map((role) => (
        <p key={props.data.name + '_' + role}>— {role}</p>
      ))}
    </div>
  );
}

export default TeamCard;
