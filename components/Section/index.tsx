import React from 'react';

import styles from '../../styles/Section.module.scss';

interface SectionProps {
  title: string;
  children: JSX.Element;
  body?: string;
}

function Section(props: SectionProps): JSX.Element {
  const {title, body, children} = props;
  return (
    <div className={'section'} id={title}>
      <div>
        <h2 className={styles.heading}>{title}</h2>
        {body && <p className={styles['section-body']}>{body}</p>}
        <div className={styles['section-items']}>
          {children}
        </div>
      </div>
    </div>
  );
}

export default Section;
