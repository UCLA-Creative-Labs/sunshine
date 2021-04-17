import { GetStaticProps } from 'next';
import React, { useState } from 'react';
import Layout from '../components/Layout';
import Splash from '../components/Splash';
import Section from '../components/Section';
import SunMoon from '../components/Splash/SunMoon';
import { fetchProjects, Project } from '../utils';
import { ProjectItemProps } from '../components/Section/ProjectItem';

interface TeamProps {
  data: Project[];
}

function Team(props: TeamProps): JSX.Element {
  const {data} = props;
  const allItems: ProjectItemProps[] = data.map(({title, description, img, quarter}) => ({
    title: title,
    body: description,
    imgUrl: img,
    preface: quarter,
  }));
  const [quarter, setQuarter] = useState({ value: 'All Quarters', label: 'All Quarters' });

  return (
    <Layout>
      <>
      <Splash
          halve={true}
          heading={'We make cool stuff.'}
          description={'We thrive on creativity — check out the drip our community has created.'}>
            <SunMoon />
        </Splash>
      <Section
        title={'What we’re working on right now.'}
        body={'Our current projects for Spring 2021 – hover over for more information about each project!'}
        items={[]}
        hasBackdrop={true}
        />
      <Section
        title={'It’s all in the past now'}
        body={'Check out the super cool projects we’ve done in the past!'}
        items={allItems}
        />
      </>
    </Layout>
  );
}

export const getStaticProps: GetStaticProps = async () => {
  const data = await fetchProjects();
  const reshapedData = data.map(({projectTitle, projectQuarter, photo, description,...rest}) => {
    return {
      title: projectTitle,
      img: photo.url,
      quarter: projectQuarter,
      description: description.json.content[0].content[0].value,
      ...rest
  };
  });
  return {
    props: {data: reshapedData},
  };
};

export default Team;
