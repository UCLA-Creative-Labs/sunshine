import Link from 'next/link';
import {useRouter} from 'next/router';
import React, { useState, useEffect, useRef, useContext } from 'react';

import { AppContext } from '../pages/_app';
import colors from '../styles/_variables.module.scss';
import styles from '../styles/Navbar.module.scss';

const path2Display = {
  '/team': 'About',
  '/projects': 'Projects',
  '/blog': 'Blog',
  '/join': 'Apply',
};

function Navbar(): JSX.Element {
  const {isDay} = useContext(AppContext);
  const pathname = useRouter().pathname;
  const [ scrollTop, setScrollTop ] = useState<number>(0);

  const navbarRef = useRef<HTMLDivElement>(null);
  const logoRef = useRef<HTMLDivElement>(null);

  // Thinking this should be a useCallback...
  const setNavStyle = (setDay: boolean) => {
    if (!navbarRef.current || !logoRef.current)
      return;
    const navbarStyle = navbarRef.current.style;
    const logoStyle = logoRef.current.style;

    navbarStyle.backgroundColor = setDay ? colors.splashBgDay : colors.navbarBgScroll;
    navbarStyle.color = setDay ? colors.navbarText : colors.navbarTextScroll;
    logoStyle.filter = setDay ? 'invert(0%)' : 'invert(100%)';
  };

  useEffect(() => {
    const onScroll = () => {
      setScrollTop(document.documentElement.scrollTop);
    };

    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setNavStyle(isDay);
  }, [ isDay ]);

  useEffect(() => {
    const vpHeight = window.innerHeight;
    setNavStyle((scrollTop < 0.2 * vpHeight) && isDay);
  }, [ scrollTop ]);

  return (
    <nav id={styles.navbar} ref={navbarRef}>
      <Link href='/'>
        <div id={styles.logo} ref={logoRef} />
      </Link>
      {Object.entries(path2Display).map(([path, display]) =>
        <Link href={path} key={display}>
          <h4 style={{fontWeight: path === pathname ? 700 : 400}}>{display}</h4>
        </Link>,
      )}
    </nav>
  );
}

export default Navbar;
