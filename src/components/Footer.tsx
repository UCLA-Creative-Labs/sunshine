import React from 'react';

import './styles/Footer.scss';

function Footer(): React.Component {
  return (
    <div id='footer'>
      <span id='footer-tag'>
        <p>Made with ❥ by</p>
        <h3 className='logotype'>
          CREATIVE LABS
        </h3>
      </span>
      <div id='footer-nav'>
        <nav>
          <a>FACEBOOK</a>
          <a>INSTAGRAM</a>
          <a>MEDIUM</a>
        </nav>
      </div>
    </div>
  );
}

export default Footer;
