import React from 'react';

import SunMoon from './SunMoon';

import '../styles/Splash.scss';

function Splash(): React.Component {
  return (
    <div className='section' id='splash'>
      <SunMoon />
      <h2 id='blurb'>
        We are a community of students at UCLA working together to discover and pursue our creative passions.
      </h2>
    </div>
  );
}

export default Splash;
