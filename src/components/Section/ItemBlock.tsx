import React from 'react';

import { SectionItem } from '../Section';

import '../styles/Section.scss';

interface ItemBlockProps {
  data: SectionItem;
}

function ItemBlock(props: ItemBlockProps): JSX.Element {
  return (
    <a
      className={props.data.linkPath && ' item-link'}
      style={{
        ...(!window.matchMedia('(max-width: 600px)').matches ? {
          flex: 1,
          margin: '5px',
          border: '1px solid black'
        } : {})
      }}
      target='_blank'
      rel='noreferrer'
      href={props.data.linkPath} >
      <div
        className='item-block'
        style={{
          ...(window.matchMedia('(max-width: 600px)').matches ? {
            margin: '5px',
            marginBottom: '15px',
            border: '1px solid black'
          } : {})
        }}>
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
