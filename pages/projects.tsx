import { GetStaticProps } from 'next';
import React, { useState } from 'react';
import Layout from '../components/Layout';
import Splash from '../components/Splash';
import { fetchProjects, Project } from '../utils';

interface TeamProps {
  data: Project[];
}

function Team(props: TeamProps): JSX.Element {
  const [quarter, setQuarter] = useState({ value: 'All Quarters', label: 'All Quarters' });
  console.log(props.data);

  return (
    <Layout>
      <>
      <div>
        Projects
      </div>
      </>
    </Layout>
  );
}


export const getStaticProps: GetStaticProps = async () => {
  const data = await fetchProjects();
  return {
    props: {data},
  };
};

export default Team;
