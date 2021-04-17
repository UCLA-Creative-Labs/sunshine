import Link from 'next/link';
import React from 'react';
import colors from '../../styles/_variables.module.scss';
import styles from '../../styles/Section.module.scss';
import { ILink } from '../../utils';

export interface ItemProps {
  title: string;
  body: string;
  portrait: JSX.Element;
  preface?: string;
  link?: ILink;
  hasBackdrop?: boolean;
}

function Item(props: ItemProps): JSX.Element {
  const {portrait, title, body, preface, link, hasBackdrop} = props;
  const backdrop = hasBackdrop && {backgroundColor: colors.beige, border: '3.5px solid #000'};
  return (
    <div className={styles['section-item']} style={backdrop}>
      {portrait}
      <div className={hasBackdrop ? styles.backdrop : ''}>
        {preface && <p className={styles.preface}>{preface}</p>}
        <h3>{title}</h3>
        <p>{body}</p>
        {link &&
          <span>
            <Link href={link.url}>{link.displayText}</Link>
          </span>
        }
      </div>
    </div>
  );
}

export default Item;