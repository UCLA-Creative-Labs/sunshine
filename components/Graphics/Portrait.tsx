import React from 'react';
import styles from '../../styles/Graphics.module.scss';

interface PortraitProps {
  style?: React.CSSProperties;
}

export default function Portrait(props: PortraitProps): JSX.Element {
  const {style} = props;

  return (
    <div className={styles.container} style={style}>
      <div className={[styles.boys, styles.default].join(' ')}>
        <img src={'mascots/ellipse-boy.svg'} className={styles.ellipse}/>
        <img src={'mascots/circle-boy.svg'} className={styles.circle}/>
        <img src={'mascots/triangle-boy.svg'} className={styles.triangle}/>
      </div>
    </div>
  );
}

export function Events(props: PortraitProps): JSX.Element {
  const {style} = props;

  return (
    <div id={styles.events} className={styles.container} style={style}>
      <div className={[styles.boys].join(' ')}>
        <img src={'mascots/ellipse-boy.svg'} className={styles.ellipse}/>
        <img src={'mascots/circle-boy.svg'} className={styles.circle}/>
        <img src={'mascots/triangle-boy.svg'} className={styles.triangle}/>
      </div>
    </div>
  );
}
