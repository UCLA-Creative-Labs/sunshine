import { GetStaticProps } from 'next';
import React, { CSSProperties, useState } from 'react';
import Select from 'react-select';
import Layout from '../components/Layout';
import TeamCard from '../components/TeamCard';
import styles from '../styles/Team.module.scss';
import {Person, roles_index, fetchTeam} from '../utils';

interface TeamProps {
  data: Person[];
}

const roles = ['All Roles', 'Designer', 'Developer', 'Director', 'External', 'Projects'];
const roleOptions = roles.map(item => ({ value: item, label: item }));

// Set June to be the cut off day for the start of a new year
const currYear = Math.floor(new Date().getFullYear() + ((new Date().getMonth() - 5 ) / 12));
const yearOptions = ['All Years', currYear + 1, currYear + 2, currYear + 3, currYear + 4, 'Alumni'].map(item => ({ value: item, label: item }));

const selectStyles = {
  control: (provided: CSSProperties, _) => ({
    ...provided,
    borderRadius: '0',
    padding: '8px 4px 8px 8px',
  }),
  menu: (provided: CSSProperties, _) => ({
    ...provided,
    borderRadius: '0',
  }),
  dropdownIndicator: (provided: CSSProperties, _) => ({
    ...provided,
    color: 'black',
  }),
  indicatorSeparator: (provided: CSSProperties, _) => ({
    ...provided,
    display: 'none',
  }),
};

function Team(props: TeamProps): JSX.Element {
  const [year, setYear] = useState({ value: 'All Years', label: 'All Years' });
  const [role, setRole] = useState({ value: 'All Roles', label: 'All Roles' });

  let filteredData = props.data.filter((person) => person.class && person.name && person.roles);

  filteredData.forEach(person =>
    person.roles.sort((a, b) => roles_index.indexOf(a) - roles_index.indexOf(b)));

  filteredData = filteredData.filter((person) => person.class >= currYear);

  filteredData.sort((a, b) => {
    const isAlumni_a = a.class == currYear;
    const isAlumni_b = b.class == currYear;

    if (+isAlumni_a ^ +isAlumni_b && isAlumni_b) return -1; //eslint-disable-line no-bitwise
    if (+isAlumni_a ^ +isAlumni_b && isAlumni_a) return 1;  //eslint-disable-line no-bitwise

    const min_a = Math.min(...a.roles.map((r) => roles_index.indexOf(r)));
    const min_b = Math.min(...b.roles.map((r) => roles_index.indexOf(r)));

    return min_a - min_b || (a.name < b.name ? -1 : 1);
  });

  if (year.value !== 'All Years') {
    if (year.value === 'Alumni') {
      filteredData = filteredData.filter((person) => person.class <= currYear);
    }
    else {
      filteredData = filteredData.filter((person) => person.class === +year.value);
    }
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
  return {
    props: {data},
  };
};

export default Team;
