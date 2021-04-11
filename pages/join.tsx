import React from 'react';
import Portrait, {PORTRAIT_MODE, SPOTLIGHT } from '../components/Graphics/Portrait';
import Layout from '../components/Layout';
import Section from '../components/Section';
import { ItemProps } from '../components/Section/Item';
import Splash from '../components/Splash';
import SunMoon from '../components/Splash/SunMoon';
import styles from '../styles/Join.module.scss';

const roles: ItemProps[] = [
  {
    portrait: <Portrait mode={PORTRAIT_MODE.PLAY} spotlight={SPOTLIGHT.ELLIPSE} />,
    preface: 'BEFORE EACH QUARTER',
    title: 'Project Lead',
    body: 'Have a cool idea? Apply to be a Project Lead and make it happen.',
  },
  {
    portrait: <Portrait mode={PORTRAIT_MODE.PLAY} spotlight={SPOTLIGHT.CIRCLE} />,
    preface: 'AT THE BEGINNING OF EACH QUARTER',
    title: 'Project Member',
    body: 'Want to be a part of something wonderful? Apply as a Project Member. Experience varies per project.',
  },
  {
    portrait: <Portrait mode={PORTRAIT_MODE.PLAY} spotlight={SPOTLIGHT.TRIANGLE} />,
    preface: '24/7',
    title: 'Board Member',
    body: 'Interesting in helping the CL community? Apply as a board member.',
  },
];

function Join(): JSX.Element {
  return (
    <Layout>
      <>
        <Splash
          halve={true}
          heading={'Join us.'}
          description={'Creative Labs is a growing community and we want you to grow with us.'}>
          <SunMoon />
        </Splash>
        <Section
          title={'We have 3 roles!'}
          body={'Everyone is already part of the Creative Labs community!  We also have various roles that students can apply to every quarter. Before applying, we recommend reading the respective guides written by the Internal Team.'}
          items={roles}/>
      </>
    </Layout>
  );
}

export default Join;