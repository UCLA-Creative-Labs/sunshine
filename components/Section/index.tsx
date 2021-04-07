import React from 'react';

import styles from '../../styles/Section.module.scss';
import ItemBlock from './ItemBlock';

export interface SectionItem {
  image: string;
  title: string;
  body: string;
  linkText?: string;
  linkPath?: string;
}

interface SectionProps {
  title: string;
  data: SectionItem[];
  body?: string;
  linkText?: string;
  linkPath?: string;
}

function Section(props: SectionProps): JSX.Element {
  return (
    <div className={'section'} id={props.title.toLowerCase()}>
      <div>
        <h1>{props.title.toUpperCase()}</h1>
        {props.body && <p className='item-body'>{props.body}</p>}
        <div className={styles['section-items']}>
          {props.data.map(data =>
            <ItemBlock
              data={data}
              key={data.title}
              newTab={data.linkPath != undefined && !data.linkPath.startsWith('/')} />) }
        </div>
        <a className={styles['section-link-text']} target='_blank' rel='noreferrer' href={props.linkPath} >
          {props.linkText && props.linkText.toUpperCase()}
        </a>
      </div>
    </div>
  );
}

export default Section;
