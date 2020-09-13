import React, { useEffect, useRef } from 'react';

import '../styles/Splash.scss';

interface SunMoonProps {
  isDay: boolean;
  mousePos: number[];
}

function SunMoon(props: SunMoonProps): React.Component {
  const bg = useRef<HTMLDivElement>(null);
  const face = useRef<HTMLDivElement>(null);
  const bgRect = useRef<DOMRect>(null);
  const faceRect = useRef<DOMRect>(null);
  const radius = useRef<number>(0);

  useEffect(() => {
    // perform one-time calculations here to save resources
    bgRect.current = bg.current.getBoundingClientRect();
    faceRect.current = face.current.getBoundingClientRect();
    radius.current = 0.4 /* arbitrary */ * (bgRect.current.width / 2);
  }, []);

  useEffect(() => {
    if (!props.mousePos) return;

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
    <div id={'sunmoon'} ref={bg} className={props.isDay ? 'day' : 'night'}>
      <div id='sunmoon-face' ref={face} />
    </div>
  );
}

export default SunMoon;
