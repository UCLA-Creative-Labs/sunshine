import React from 'react';

import styles from '../../styles/Section.module.scss';
import Item, {ItemProps} from './Item';

interface SectionProps {
  title: string;
  items: ItemProps[];
  body?: string;
}

function Section(props: SectionProps): JSX.Element {
  const {title, body, items} = props;
  return (
    <div className={'section'} id={title}>
      <div>
        <h2 className={styles.heading}>{title}</h2>
        {body && <p className={styles['section-body']}>{body}</p>}
        <div className={styles['section-items']}>
          {items.map((itemProps) =>
            <Item {...itemProps} key={itemProps.title}/>,
          )}
        </div>
      </div>
    </div>
  );
}

export default Section;
