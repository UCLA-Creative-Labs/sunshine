import React from 'react';

import { SectionItem } from '../Section';

import '../styles/Section.scss';

interface ItemBlockProps {
  data: SectionItem;
  newTab?: boolean;
}

function ItemBlock(props: ItemBlockProps): JSX.Element {
  return (
    <a
      className={props.data.linkPath && 'item-link'}
      target={props.newTab ? '_blank' : undefined}
      rel={props.newTab ? 'noreferrer' : undefined}
      href={props.data.linkPath} >
      <div className='item-block'>
        <img
          className='item-img'
          src={props.data.image}
          alt={props.data.title} />
        <h3 className='item-title'>{props.data.title}</h3>
        <p className='item-body'>{props.data.body}</p>
        <a className='item-link-text'>{ props.data.linkText && props.data.linkText.toUpperCase()}</a>
      </div>
    </a>
  );
}

export default ItemBlock;
