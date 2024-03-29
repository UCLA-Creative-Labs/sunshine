import React from 'react';

import './styles/Footer.scss';

function Footer(): JSX.Element {
  return (
    <div id='footer'>
      <span id='footer-tag'>
        <p>Made with <span aria-label='heart' role='img'>❤️</span> by</p>
        <h3 className='logotype'>
          CREATIVE LABS
        </h3>
      </span>
      <div id='footer-nav'>
        <nav>
          <a target='_blank' rel='noreferrer' href='https://www.instagram.com/creativelabsucla/'>INSTAGRAM</a>
          <a target='_blank' rel='noreferrer' href='https://discord.gg/vHenfGNTXJ'>DISCORD</a>
        </nav>
      </div>
    </div>
  );
}

export default Footer;
