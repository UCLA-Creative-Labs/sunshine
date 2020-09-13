import React, { useState } from 'react';

import SunMoon from './SunMoon';

import '../styles/Splash.scss';

interface SplashProps {
  isDay: boolean;
  mousePos: number[];
}

function Splash(props: SplashProps): React.Component {
  return (
    <div id='splash' className={'section' + (props.isDay ? ' day' : ' night')}>
      <SunMoon isDay={props.isDay} mousePos={props.mousePos} />
      <h2 id='blurb'>
        We are a community of students at UCLA working together to discover and pursue our creative passions.
      </h2>
    </div>
  );
}

export default Splash;
