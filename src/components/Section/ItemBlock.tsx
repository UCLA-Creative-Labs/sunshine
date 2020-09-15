import React from 'react';

import { SectionItem } from '../Section';

import '../styles/Section.scss';

interface ItemBlockProps {
  data: SectionItem;
}

function ItemBlock(props: ItemBlockProps): JSX.Element {
  return (
    <div className='item-block'>
      <img
        className='item-img'
        src={props.data.image}
        alt={props.data.title} />
      <h3 className='item-title'>{props.data.title}</h3>
      <p className='item-body'>{props.data.body}</p>
      { props.data.linkText && <a>{props.data.linkText.toUpperCase()}</a>}
    </div>
  );
}

export default ItemBlock;
