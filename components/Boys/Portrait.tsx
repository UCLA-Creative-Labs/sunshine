import React from 'react';
import styles from '../../styles/Boys.module.scss';

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
  )
}