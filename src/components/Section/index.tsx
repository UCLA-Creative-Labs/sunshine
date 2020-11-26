import React from 'react';

import ItemBlock from './ItemBlock';

interface SectionItem {
  image: string;
  title: string;
  body: string;
  linkText?: string;
  linkPath?: string;
}

interface SectionProps {
  title: string;
  data: SectionItem[];
  linkText?: string;
  linkPath?: string;
}

function Section(props: SectionProps): JSX.Element {
  props.data.forEach(data => data.image.indexOf('/assets/') == -1 ? data.image = `/assets/${data.image}` : data.image);

  return (
    <div className='section' id={props.title.toLowerCase()}>
      <div>
        <h1>{props.title.toUpperCase()}</h1>
        <div
          id='section-items'
          style={{
            columns: window.matchMedia('(max-width: 600px)').matches ? '1 auto' : `${props.data.length} auto`,
            marginBottom: 42,
          }}>
          { props.data.map(data =>
            <ItemBlock
              data={data}
              key={data.title}
              newTab={data.linkPath != undefined && !data.linkPath.startsWith('/')} />) }
        </div>
        <a className='section-link-text' target='_blank' rel='noreferrer' href={props.linkPath} >
          {props.linkText && props.linkText.toUpperCase()}
        </a>
      </div>
    </div>
  );
}

export default Section;
export { SectionItem };
