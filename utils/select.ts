import { CSSProperties } from "react";
import { Person } from "./contentful";
import { getCurrentYear } from "./date";

export const selectStyles = {
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

export const roles_index = [
  'Executive Director', 'Design Director', 'External Director',
  'Projects Director', 'Tech Director', 'Designer', 'Developer',
  'External', 'Projects',
];

export const makeOptions = (arr: any[]) => {
  return arr.map(e => ({value: e, label: e}));
}

export const teamFilterSort = (data: Person[]): Person[] => {
  const currYear = getCurrentYear();
  let filteredData = data.filter((person) => person.class && person.name && person.roles);

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

  return filteredData;
}

export const getYearOptions = () => {
  const currYear = getCurrentYear();
  const yearOptions = ['All Years', currYear + 1, currYear + 2, currYear + 3, currYear + 4, 'Alumni'];
  return makeOptions(yearOptions);
}

export const getRolesOptions = () => {
  const roles = ['All Roles', 'Designer', 'Developer', 'Director', 'External', 'Projects'];
  return makeOptions(roles);
}