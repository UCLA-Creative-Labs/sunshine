import Link from 'next/link';
import React, { useContext } from 'react';
import { AppContext } from '../../pages/_app';
import styles from '../../styles/Splash.module.scss';
import Stars from './Stars';
import SunMoon from './SunMoon';

interface SplashProps {
  mousePos: number[];
}

function Splash(props: SplashProps): JSX.Element {
  const {isDay} = useContext(AppContext);
  return (
    <div id={styles.splash} className={['section', (isDay ? styles.day : styles.night)].join(' ')}>
      <div>
        <SunMoon mousePos={props.mousePos} />
        {!isDay && <Stars />}
        <div id={styles.blurb}>
          <h1 id={styles.heading}>
            Let&apos;s get creative.
          </h1>
          <p id={styles.description}>
            Creative Labs is a community of students at UCLA working together
            on cool projects to discover even cooler passions.
          </p>
          <div id={styles['btn-container']}>
            <button className={styles.btn}>EXPLORE ↗︎</button>
            <Link href='/join'>
              <button className={styles.btn}>JOIN ↗︎</button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Splash;
