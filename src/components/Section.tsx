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

function Section(props: SectionProps): React.Component {
  props.data.forEach(data => data.image.indexOf('/assets/') == -1 ? data.image = `/assets/${data.image}` : data.image);

  return (
    <div className='section' id={props.title.toLowerCase()}>
      <h1>{props.title.toUpperCase()}</h1>
      <div
        id='section-items'
        style={{ columns: `${props.data.length} auto`, marginBottom: 42 }}>
        { props.data.map(data => <ItemBlock data={data} key={data.title} />) }
      </div>
      {props.linkText && <a>{props.linkText.toUpperCase()}</a>}
    </div>
  );
}

export default Section;
export { SectionItem };
