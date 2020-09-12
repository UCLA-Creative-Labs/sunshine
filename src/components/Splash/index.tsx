import React from 'react';

import SunMoon from './SunMoon';

import '../styles/Splash.scss';

interface SplashProps {
  isDay: boolean;
}

function Splash(props: SplashProps): React.Component {
  return (
    <div className={'section' + (props.isDay ? ' day' : ' night')} id='splash'>
      <SunMoon isDay={props.isDay} />
      <h2 id='blurb'>
        We are a community of students at UCLA working together to discover and pursue our creative passions.
      </h2>
    </div>
  );
}

export default Splash;
