import React from 'react';

import SunMoon from './Splash/SunMoon';

import './styles/Construction.scss';
import './styles/Splash.scss';

interface ConstructionProps {
  isDay: boolean;
  mousePos: number[];
}

function Construction(props: ConstructionProps): JSX.Element {
  return (
    <div id='construction' className={'section' + (props.isDay ? ' day' : ' night')}>
      <SunMoon isDay={props.isDay} mousePos={props.mousePos} />
      <h2 id='blurb'>
      This page is still under construction.
      </h2>
    </div>
  );
}

export default Construction;
