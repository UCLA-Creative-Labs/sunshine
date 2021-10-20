import React from 'react';
import ReactTooltip from 'react-tooltip';

import styles from '../styles/Team.module.scss';
import { Person } from '../utils';

interface TeamCardProps {
  data: Person;
  alumni: boolean;
}

function TeamCard(props: TeamCardProps): JSX.Element {
  const image = <img className={styles['team-img']} src={props.data.image} alt={props.data.name} />;

  return (
    <div className={styles['team-card']}>
      <div className={styles.profile}>
        {props.data.link ? (
          <>
            <a
              data-tip
              data-for={props.data.name}
              target='_blank'
              rel='noreferrer'
              href={props.data.link}
            >
              {image}
            </a>
            <ReactTooltip id={props.data.name} className={styles['team-tooltip']} arrowColor='transparent' textColor='black' backgroundColor='#FFF740'>
              {props.data.link.split('//').slice(-1)[0] + ' ↗'}
            </ReactTooltip>
          </>
        ) : (
          image
        )}
      </div>
      <h4 className={styles['team-title']}>{props.data.name}</h4>
      <p>{props.alumni ? 'ALUMNI' : `CLASS OF ${props.data.class}`}</p>
      {props.data.roles.map((role) => (
        <p key={props.data.name + '_' + role}>— {role}</p>
      ))}
    </div>
  );
}

export default TeamCard;
