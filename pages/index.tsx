import Link from 'next/link';
import React, { useContext, useEffect, useState } from 'react';

import {Lecture, Portrait, Phone} from '../components/Graphics';
import Layout from '../components/Layout';
import Section from '../components/Section';
import Splash from '../components/Splash';

import colors from '../styles/_variables.module.scss';
import styles from '../styles/Home.module.scss';
import { AppContext } from './_app';

const opportunities = [
  {
    portrait: <Phone.default />,
    title: 'Projects',
    description: 'Our projects are a quarter-long and open to all majors.',
    link: '/projects',
  },
  {
    portrait: <Portrait.Events />,
    title: 'Events',
    description: 'We invite industry professionals or companies to talk about the field.',
    link: '/events',
  },
  {
    portrait: <Lecture.default />,
    title: 'Workshops',
    description: 'Learn something new at one of our workshops.',
    link: '/workshops',
  },
];

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
              <h2>Who are we?</h2>
              <p>
                The Creative Labs community is managed by a small team of developers, designers,
                and project managers.
              </p>
              <p>
                We give students the platform that allows them to make their ideas come to
                life. We were founded on the dream to just make cool things.
              </p>
              <span>
                <Link href='/team'>LEARN MORE</Link>
              </span>
            </div>
          </div>
        </div>
        <Section
          title={'So, what can I do?'}
          body={'Whether you’re in a project or not, you are still a part of the Creative Labs community. We have new events, quarters, and workshops every quarter.'}>
          <>
            {opportunities.map(({title, description, link, portrait}) =>
              <div className={styles['section-item']} key={title}>
                {portrait}
                <h3>{title}</h3>
                <p>{description}</p>
                <span>
                  <Link href={link}>LEARN MORE</Link>
                </span>
              </div>,
            )}
          </>
        </Section>
      </div>
    </Layout>
  );
}
