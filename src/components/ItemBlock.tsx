import React from 'react';

import { SectionItem } from './Section';

import './styles/ItemBlock.scss';

interface ItemBlockProps {
  image: string;
  data: SectionItem;
}

function ItemBlock(props: ItemBlockProps): React.Component {
  return (
    <div className='item-block'>
      <img
        className='item-img'
        src={props.data.image} />
      <h3 className='item-title'>{props.data.title}</h3>
      <p className='item-body'>{props.data.body}</p>
      { props.data.linkText && <a>{props.data.linkText.toUpperCase()}</a>}
    </div>
  );
}

export default ItemBlock;
