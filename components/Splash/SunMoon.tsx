import React, { useContext, useEffect, useRef } from 'react';
import { AppContext } from '../../pages/_app';

import styles from '../../styles/Splash.module.scss';
import { _DOMRect } from '../../utils';

interface SunMoonProps {
  mousePos: number[];
}

function SunMoon(props: SunMoonProps): JSX.Element {
  const {isDay} = useContext(AppContext);
  const bg = useRef<HTMLDivElement>(null);
  const face = useRef<HTMLDivElement>(null);
  const bgRect = useRef<DOMRect>(new _DOMRect());
  const faceRect = useRef<DOMRect>(new _DOMRect());
  const radius = useRef<number>(0);

  useEffect(() => {
    if (!bg.current || !face.current)
      return;
    // perform one-time calculations here to save resources
    bgRect.current = bg.current.getBoundingClientRect();
    faceRect.current = face.current.getBoundingClientRect();
    radius.current = 0.4 /* arbitrary */ * (bgRect.current.width / 2);
  }, []);

  useEffect(() => {
    if (!props.mousePos || !face.current) return;

    const style = face.current.style;

    const mouseDist = [
      props.mousePos[0] - bgRect.current.left - bgRect.current.width/2,
      props.mousePos[1] - bgRect.current.top - bgRect.current.height/2,
    ];
    const theta = Math.atan2(mouseDist[1], mouseDist[0]);
    const rcos = radius.current * Math.cos(theta);
    const rsin = radius.current * Math.sin(theta);
    const clampedDistance = [
      mouseDist[0] < 0 ? Math.max(rcos, mouseDist[0]) : Math.min(rcos, mouseDist[0]),
      mouseDist[1] < 0 ? Math.max(rsin, mouseDist[1]) : Math.min(rsin, mouseDist[1]),
    ];

    // small delay to make it seem smoother
    setTimeout(() => {
      style.left = `${clampedDistance[0] + bgRect.current.width/2 - faceRect.current.width/2}px`;
      style.top = `${clampedDistance[1] + bgRect.current.height/2 - faceRect.current.height/2}px`;
    }, 150);
  }, [ props.mousePos ]);

  return (
    <div id={styles.sunmoon} ref={bg} className={isDay ? styles.day : styles.night}>
      <div id={styles['sunmoon-face']} ref={face} />
    </div>
  );
}

export default SunMoon;
