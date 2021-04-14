import { GetStaticProps } from 'next';
import React, { useState } from 'react';
import Select from 'react-select';
import Layout from '../components/Layout';
import TeamCard from '../components/TeamCard';
import styles from '../styles/Team.module.scss';
import {Person, roles_index, fetchTeam, getRolesOptions, getYearOptions, getCurrentYear, teamFilterSort, selectStyles} from '../utils';

interface TeamProps {
  data: Person[];
}

function Team(props: TeamProps): JSX.Element {
  const [year, setYear] = useState({ value: 'All Years', label: 'All Years' });
  const [role, setRole] = useState({ value: 'All Roles', label: 'All Roles' });

  const currYear = getCurrentYear();
  const yearOptions = getYearOptions();
  const roleOptions = getRolesOptions();

  let filteredData = props.data;
  if (year.value !== 'All Years') {
    filteredData = filteredData.filter((person) => year.value === 'Alumni'
      ? person.class <= currYear
      : person.class === +year.value);
  }

  if (role.value !== 'All Roles') {
    filteredData = filteredData.filter((person) =>
      person.roles.some((r) => r === role.value || r.includes(role.value)));
  }

  return (
    <Layout>
      <div className={styles['team-page']}>
        <h3>THE TEAM</h3>
        <div className={styles['team-content']}>
          <div className={styles['team-left']}>
            <Select
              className={styles['team-select']}
              styles={selectStyles}
              name='year'
              onChange={setYear}
              value={year}
              placeholder='Year'
              options={yearOptions}
              isSearchable={false}
              aria-label='Filter by Year'
            />
            <Select
              className={styles['team-select']}
              styles={selectStyles}
              name='role'
              onChange={setRole}
              value={role}
              placeholder='Role'
              options={roleOptions}
              isSearchable={false}
              aria-label='Filter by Role'
            />
          </div>
          <div className={styles['team-cards']}>
            {filteredData.length
              ? filteredData.map((person) => (
                <TeamCard
                  key={person.name}
                  data={person}
                  alumni={person.class <= currYear}
                />
              ))
              : 'No one was found.'}
          </div>
        </div>
      </div>
    </Layout>
  );
}

export const getStaticProps: GetStaticProps = async () => {
  const res = await fetchTeam();
  const data = res?.map((person: any) => {
    person.image = person?.photo?.url ?? '/spring.svg';
    person.link = person.website ?? person.github ?? person.instagram;
    return person;
  });
  const filteredData = teamFilterSort(data);
  return {
    props: {data: filteredData},
  };
};

export default Team;
