import React from 'react';

import SunMoon from './SunMoon';

import styles from '../../styles/Splash.module.scss';

interface SplashProps {
  isDay: boolean;
  mousePos: number[];
}

function Splash(props: SplashProps): JSX.Element {
  return (
    <div id={styles.splash} className={['section', (props.isDay ? styles.day : styles.night)].join(' ')}>
      <div>
        <SunMoon isDay={props.isDay} mousePos={props.mousePos} />
        <h2 id={styles.blurb}>
          A community of UCLA creatives working on cool projects to discover even cooler passions
        </h2>
      </div>
    </div>
  );
}

export default Splash;
