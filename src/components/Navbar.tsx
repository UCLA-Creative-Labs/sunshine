import React, { useState, useEffect, useRef } from 'react';
import { useLocation} from 'react-router-dom';

import colors from './styles/_variables.scss';
import './styles/Navbar.scss';

interface NavbarProps {
  isDay: boolean;
}

function Navbar(props: NavbarProps): JSX.Element {
  const [ scrollTop, setScrollTop ] = useState<number>(0);
  const [ sectionScrollStates, setSectionScrollStates ]
    = useState<boolean[]>([ true, false, false, false ]);
  const location = useLocation();

  const navbarRef = useRef<HTMLDivElement>(null);
  const navigationRef = useRef<HTMLDivElement>(null);
  const logoRef = useRef<HTMLDivElement>(null);
  const sectionsRef = useRef<(HTMLElement | null)[]>([]);

  const isElementInView = (el: HTMLElement | null): boolean => {
    if (!el) return false;
    const rect: DOMRect = el.getBoundingClientRect();
    return (rect.top >= 0 && rect.top <= window.innerHeight * 0.4)
      || (rect.bottom <= window.innerHeight && rect.bottom >= window.innerHeight * 0.4);
  };

  const toNightStyle = () => {
    if (!navbarRef.current || !navigationRef.current || !logoRef.current)
      return;
    const navbarStyle = navbarRef.current.style;
    const navigationStyle = navigationRef.current.style;
    const logoStyle = logoRef.current.style;

    navbarStyle.backgroundColor = colors.navbarBgScroll;
    navbarStyle.color = colors.navbarTextScroll;
    navigationStyle.color = colors.navbarTextScroll;
    logoStyle.filter = 'invert(100%)';
  };

  const toDayStyle = () => {
    if (navbarRef.current == null || navigationRef.current == null || logoRef.current == null)
      return;
    const navbarStyle = navbarRef.current.style;
    const navigationStyle = navigationRef.current.style;
    const logoStyle = logoRef.current.style;

    navbarStyle.backgroundColor = colors.splashBgDay;
    navbarStyle.color = colors.navbarText;
    navigationStyle.color = colors.navbarText;
    logoStyle.filter = 'invert(0%)';
  };

  useEffect(() => {
    // default to body if the element can't be found
    sectionsRef.current = [
      document.getElementById('splash'),
      document.getElementById('about'),
      document.getElementById('projects'),
      document.getElementById('fellowship'),
    ];
  }, []);

  useEffect(() => {
    if (!props.isDay) toNightStyle();
  }, [ props.isDay ]);

  useEffect(() => {
    const vpHeight = window.innerHeight;

    if ((scrollTop < 0.2 * vpHeight) && props.isDay)
      toDayStyle();
    else
      toNightStyle();

    const onScroll = () => {
      setScrollTop(document.documentElement.scrollTop);

      for (let i = 0; i < sectionsRef.current.length; i++) {
        if (isElementInView(sectionsRef.current[i])) {
          const scrollState: boolean[] = new Array(sectionsRef.current.length).fill(false);
          scrollState[i] = true;
          setSectionScrollStates(scrollState);
        }
      }

    };

    window.addEventListener('scroll', onScroll);

    return () => window.removeEventListener('scroll', onScroll);
  }, [ scrollTop ]);

  /**
   * Scroll to section if on the root path
   *
   * @param el the section element to scroll to
   */
  const scrollToElement = (el: HTMLElement | null) => {
    if (location.pathname !== '/') {
      window.location.href = '/';
    }
    if (!el) return;
    const navbar = document.getElementById('navbar');
    const navbarHeight = navbar?.offsetHeight ?? document.body.offsetHeight - el.offsetHeight;
    window.scrollBy({
      top: el.getBoundingClientRect().top - navbarHeight,
      left: 0,
      behavior: 'smooth',
    });
  };

  return (
    <div id={'navbar'} ref={navbarRef}>
      <h3 id={'title'} className={'logotype'} onClick={() => scrollToElement(sectionsRef.current[0], 'home')}>
        <div id={'logo'} ref={logoRef} />
        CREATIVE LABS
      </h3>
      <div id={'navigation'} ref={navigationRef}>
        <nav>
          <a
            onClick={() => scrollToElement(sectionsRef.current[0])}
            style={{ fontWeight: sectionScrollStates[0] ? 700 : 400 }}>
            HOME
          </a>
          <a
            onClick={() => scrollToElement(sectionsRef.current[1])}
            style={{ fontWeight: sectionScrollStates[1] ? 700 : 400 }}>
            ABOUT
          </a>
          <a
            onClick={() => scrollToElement(sectionsRef.current[2])}
            style={{ fontWeight: sectionScrollStates[2] ? 700 : 400 }}>
            PROJECTS
          </a>
          <a
            onClick={() => scrollToElement(sectionsRef.current[3])}
            style={{ fontWeight: sectionScrollStates[3] ? 700 : 400 }}>
            FELLOWSHIP
          </a>
        </nav>
      </div>
    </div>
  );
}

export default Navbar;
