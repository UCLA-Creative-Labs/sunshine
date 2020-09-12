import React from 'react';

import '../styles/Splash.scss';

interface SunMoonProps {
  isDay: boolean;
}

function SunMoon(props: SunMoonProps): React.Component {
  return (
    <div id={'sunmoon'} className={props.isDay ? 'day' : 'night'}>
      <div id='sunmoon-face' />
    </div>
  );
}

export default SunMoon;
