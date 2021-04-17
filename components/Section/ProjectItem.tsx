import React from 'react';
import colors from '../../styles/_variables.module.scss';
import styles from '../../styles/Section.module.scss';
import { ILink } from '../../utils';

export interface ProjectItemProps {
  title: string;
  imgUrl: string;
  body?: string;
  preface?: string;
}

function ProjectItem(props: ProjectItemProps): JSX.Element {
  const {imgUrl, title, body, preface} = props;
  return (
    <div className={styles['section-project-item']}>
      <img src={imgUrl}/>
      {preface && <p className={styles.preface}>{preface}</p>}
      <div>
        <h3>{title}</h3>
      </div>
    </div>
  );
}

export default ProjectItem;