import React from 'react';

import SunMoon from './SunMoon';

import '../styles/Splash.scss';

interface SplashProps {
  isDay: boolean;
  mousePos: number[];
}

function Splash(props: SplashProps): JSX.Element {
  return (
    <div id='splash' className={'section' + (props.isDay ? ' day' : ' night')}>
      <SunMoon isDay={props.isDay} mousePos={props.mousePos} />
      <h2 id='blurb'>
      UCLA’s only community of creatives—working on cool projects every quarter.
      </h2>
    </div>
  );
}

export default Splash;
