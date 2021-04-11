import React from 'react';
import styles from '../../styles/Graphics.module.scss';

interface PortraitProps {
  mode: PORTRAIT_MODE;
  style?: React.CSSProperties;
  spotlight?: SPOTLIGHT;
}

export enum PORTRAIT_MODE {
  FAMILY='FAMILY',
  PLAY='PLAY',
}

export enum SPOTLIGHT {
  ELLIPSE='ELLIPSE',
  CIRCLE='CIRCLE',
  TRIANGLE='TRIANGLE',
}

export default function Portrait(props: PortraitProps): JSX.Element {
  const {mode, style, spotlight} = props;

  const portraitId = mode === PORTRAIT_MODE.PLAY ? styles.play : '';
  const grayBackground = spotlight && {backgroundColor: '#C4C4C4'};
  const filter = (t_spotlight: SPOTLIGHT) => spotlight && t_spotlight !== spotlight
    ? {filter: 'grayscale(1)'}
    : {};

  return (
    <div id={portraitId} className={styles.container} style={{...style, ...grayBackground}}>
      <div className={[styles.boys, styles.default].join(' ')}>
        <img src={'mascots/ellipse-boy.svg'} className={styles.ellipse} style={filter(SPOTLIGHT.ELLIPSE)}/>
        <img src={'mascots/circle-boy.svg'} className={styles.circle} style={filter(SPOTLIGHT.CIRCLE)}/>
        <img src={'mascots/triangle-boy.svg'} className={styles.triangle} style={filter(SPOTLIGHT.TRIANGLE)}/>
      </div>
    </div>
  );
}
