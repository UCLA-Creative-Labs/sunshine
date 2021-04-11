import Link from 'next/link';
import React, { useContext } from 'react';
import { AppContext } from '../../pages/_app';
import styles from '../../styles/Splash.module.scss';
import { ILink } from '../../utils';

interface SplashProps {
  heading: string;
  description: string;
  children: JSX.Element;
  buttons?: ILink[]; 
}

function Splash(props: SplashProps): JSX.Element {
  const {heading, description, children, buttons} = props;
  const {isDay} = useContext(AppContext);
  return (
    <div id={styles.splash} className={['section', (isDay ? styles.day : styles.night)].join(' ')}>
      <div>
        {children}
        <div id={styles.blurb}>
          <h1 id={styles.heading}>
            {heading}
          </h1>
          <p id={styles.description}>
            {description}
          </p>
          {buttons && 
            <div id={styles['btn-container']}>
              {buttons.map(({url, displayText}) => 
                <Link href={url}>
                  <button className={styles.btn}>{displayText}</button>
                </Link>
              )}
            </div>
          }
        </div>
      </div>
    </div>
  );
}

export default Splash;
