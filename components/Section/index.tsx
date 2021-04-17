import React from 'react';

import styles from '../../styles/Section.module.scss';
import Item, {ItemProps} from './Item';
import ProjectItem, { ProjectItemProps } from './ProjectItem';

type IItem = ItemProps | ProjectItemProps;

interface SectionProps {
  title: string;
  items: IItem[];
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
          {items.map((itemProps) => {
            if ('portrait' in itemProps)
              return <Item hasBackdrop={hasBackdrop} {...itemProps} key={itemProps.title}/>;
            else if ('imgUrl' in itemProps)
              return <ProjectItem {...itemProps} key={itemProps.title} />;
            else
              return null;
          })}
        </div>
      </div>
    </div>
  );
}

export default Section;
