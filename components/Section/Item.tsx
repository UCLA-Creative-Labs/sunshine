import Link from 'next/link';
import React from 'react';
import styles from '../../styles/Section.module.scss';
import { ILink } from '../../utils';

export interface ItemProps {
  title: string;
  portrait: JSX.Element;
  body: string;
  preface?: string;
  link?: ILink;
}

function Item(props: ItemProps): JSX.Element {
  const {portrait, title, body, preface, link} = props;
  return (
    <div className={styles['section-item']}>
      {portrait}
      {preface && <p className={styles.preface}>{preface}</p>}
      <h3>{title}</h3>
      <p>{body}</p>
      {link &&
        <span>
          <Link href={link.url}>{link.displayText}</Link>
        </span>
      }
    </div>
  );
}

export default Item;