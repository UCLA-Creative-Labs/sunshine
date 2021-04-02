import React, { useContext } from 'react';
import { AppContext } from '../../pages/_app';

import styles from '../../styles/Splash.module.scss';
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
        <h2 id={styles.blurb}>
          A community of UCLA creatives working on cool projects to discover even cooler passions
        </h2>
      </div>
    </div>
  );
}

export default Splash;
