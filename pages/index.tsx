import React, { useContext, useEffect, useState } from 'react';
import Layout from '../components/Layout';
import Section from '../components/Section';
import Splash from '../components/Splash';
import sectionItem   from '../public/sectionInfo.json';

import colors from '../styles/_variables.module.scss';
import styles from '../styles/Home.module.scss';
import { AppContext } from './_app';
import {Portrait} from '../components/Boys';
import Link from 'next/link';

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
        <div id={styles['who-container']} className={'section'}>
          <div>
            <Portrait.default />
            <div id={styles['who-description']}>
              <h3>Who are we?</h3>
              <p>
                The Creative Labs community is managed by a small team of developers, designers,
                and project managers.
              </p>
              <p>
                We give students the platform that allows them to make their ideas come to
                life. We were founded on the dream to just make cool things. 
              </p>
              <Link href='/team'>LEARN MORE</Link>
            </div>
          </div>
        </div>
        <Section
          title={'So, what can I do?'}
          data={sectionItem.projects}
          body={'Every quarter we have student teams collaborate and execute an idea.' +
                ' Below are some projects that were created in the past quarters.'}
          linkPath={'https://medium.com/creative-labs'}
          linkText={'View all projects on Medium ➔'} />
      </div>
    </Layout>
  );
}
