import React from 'react';
import ReactTooltip from 'react-tooltip';

import { Person } from '../../utils/Utils';
import '../styles/Team.scss';

interface TeamCardProps {
  data: Person;
  alumni: boolean;
}

function TeamCard(props: TeamCardProps): JSX.Element {
  const image = <img className="team-img" src={props.data.image} alt={props.data.name} />;

  return (
    <div className="team-card">
      {props.data.link ? (
        <>
          <a
            data-tip
            data-for={props.data.name}
            target="_blank"
            rel="noreferrer"
            href={props.data.link}
          >
            {image}
          </a>
          <ReactTooltip id={props.data.name} className='team-tooltip' arrowColor='transparent' textColor='black' backgroundColor='#FFF740'>
            {props.data.link.split('//').slice(-1)[0] + ' ↗'}
          </ReactTooltip>
        </>
      ) : (
        image
      )}
      <h3 className="team-title">{props.data.name}</h3>
      <p>{props.alumni ? 'ALUMNI' : `CLASS OF ${props.data.class}`}</p>
      <p style={{fontStyle: 'italic'}}>{(props.alumni && props.data.company !== null) ? `Now at: ${props.data.company}` : ''}</p>
      {props.data.roles.map((role) => (
        <p key={props.data.name + '_' + role}>— {role}</p>
      ))}
    </div>
  );
}

export default TeamCard;
