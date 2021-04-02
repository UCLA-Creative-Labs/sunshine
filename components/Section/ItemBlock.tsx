import React from 'react';

import { SectionItem } from '.';

import styles from '../../styles/Section.module.scss';

interface ItemBlockProps {
  data: SectionItem;
  newTab?: boolean;
}

function ItemBlock(props: ItemBlockProps): JSX.Element {
  return (
    <a
      className={[props.data.linkPath, styles['item-link']].join(' ')}
      style={{
        flex: 1,
        margin: '5px',
        border: '1px solid black',
      }}
      target={props.newTab ? '_blank' : undefined}
      rel={'noreferrer'}
      href={props.data.linkPath} >
      <div className={styles['item-block']}>
        <img
          className={styles['item-img']}
          src={props.data.image}
          alt={props.data.title} />
        <h3 className={styles['item-title']}>{props.data.title}</h3>
        <p className={styles['item-body']}>{props.data.body}</p>
        <a className={styles['item-link-text']}>{ props.data.linkText && props.data.linkText.toUpperCase()}</a>
      </div>
    </a>
  );
}

export default ItemBlock;
