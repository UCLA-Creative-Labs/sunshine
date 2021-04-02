import React, { useContext, useEffect, useState } from 'react';
import Layout from '../components/Layout';
import Section from '../components/Section';
import Splash from '../components/Splash';
import sectionItem   from '../public/sectionInfo.json';

import colors from '../styles/_variables.module.scss';
import { AppContext } from './_app';

export default function Home(): JSX.Element {
  const {isDay} = useContext(AppContext);
  const [ mousePos, setMousePos ] = useState<number[]>([]);
  const onMouseMove = (e: React.MouseEvent) => {
    setMousePos([ e.clientX, e.clientY ]);
  };

  useEffect(() => {
    // For Safari browsers
    if (isDay) document.body.style.backgroundColor = colors.splashBgDay;
    else document.body.style.backgroundColor = colors.splashBgNight;
  }, [ isDay ]);

  return (
    <Layout>
      <div style={{ margin: 0, padding: 0 }} onMouseMove={onMouseMove}>
        <Splash mousePos={mousePos} />
        <Section
          title={'About'}
          data={sectionItem.about} />
        <Section
          title={'Projects'}
          data={sectionItem.projects}
          body={'Every quarter we have student teams collaborate and execute an idea.' +
                ' Below are some projects that were created in the past quarters.'}
          linkPath={'https://medium.com/creative-labs'}
          linkText={'View all projects on Medium ➔'} />
      </div>
    </Layout>
  );
}
