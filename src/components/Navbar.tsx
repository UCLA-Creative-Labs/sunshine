import React, { useState, useEffect, useRef } from 'react';

import colors from './styles/_variables.scss';
import './styles/Navbar.scss';

function Navbar(): React.Component {
  const [ scrollTop, setScrollTop ] = useState(0);

  const navbarRef = useRef(null);
  const navigationRef = useRef(null);
  const logoRef = useRef(null);

  useEffect(() => {
    const vpHeight = window.innerHeight;

    const navbarStyle = navbarRef.current.style;
    const navigationStyle = navigationRef.current.style;
    const logoStyle = logoRef.current.style;

    if (scrollTop >= 0.1 * vpHeight) {
      navbarStyle.backgroundColor = colors.navbarBgScroll;
      navbarStyle.color = colors.navbarTextScroll;
      navigationStyle.color = colors.navbarTextScroll;
      logoStyle.filter = 'invert(100%)';
    } else {
      navbarStyle.backgroundColor = colors.splashBg;
      navbarStyle.color = colors.navbarText;
      navigationStyle.color = colors.navbarText;
      logoStyle.filter = 'invert(0%)';
    }

    const onScroll = ev => {
      setScrollTop(ev.target.documentElement.scrollTop);
    };
    window.addEventListener('scroll', onScroll);

    return () => window.removeEventListener('scroll', onScroll);
  }, [ scrollTop ]);

  return (
    <div id={'navbar'} ref={navbarRef}>
      <h3 id={'title'} className={'logotype'}>
        <div id={'logo'} ref={logoRef} />
        CREATIVE LABS
      </h3>
      <div id={'navigation'} ref={navigationRef}>
        <nav>
          <a style={{ fontWeight: 700 }}>HOME</a>
          <a>PROJECTS</a>
          <a>ABOUT</a>
        </nav>
      </div>
    </div>
  );
}

export default Navbar;
