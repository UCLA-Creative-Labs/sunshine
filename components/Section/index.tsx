import React from 'react';

import styles from '../../styles/Section.module.scss';
import Item, {ItemProps} from './Item';

interface SectionProps {
  title: string;
  items: ItemProps[];
  body?: string;
  hasBackdrop?: boolean;
}

function Section(props: SectionProps): JSX.Element {
  const {title, body, items, hasBackdrop} = props;
  return (
    <div className={'section'} id={title} style={hasBackdrop && {backgroundColor: '#fff'}}>
      <div>
        <h2 className={styles.heading}>{title}</h2>
        {body && <p className={styles['section-body']}>{body}</p>}
        <div className={styles['section-items']}>
          {items.map((itemProps) =>
            <Item hasBackdrop={hasBackdrop} {...itemProps} key={itemProps.title}/>,
          )}
        </div>
      </div>
    </div>
  );
}

export default Section;
