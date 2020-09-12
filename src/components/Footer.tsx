import React from 'react';

import './styles/Footer.scss';

function Footer(): React.Component {
  return (
    <div id='footer'>
      <span id='footer-tag'>
        <p>Made with <span aria-lable='heart' role='img'>❤️</span> by</p>
        <h3 className='logotype'>
          CREATIVE LABS
        </h3>
      </span>
      <div id='footer-nav'>
        <nav>
          <a target='_blank' rel='noreferrer' href='https://www.facebook.com/uclacreatives'>FACEBOOK</a>
          <a target='_blank' rel='noreferrer' href='https://www.instagram.com/creativelabsucla/'>INSTAGRAM</a>
          <a target='_blank' rel='noreferrer' href='https://medium.com/creative-labs'>MEDIUM</a>
        </nav>
      </div>
    </div>
  );
}

export default Footer;
