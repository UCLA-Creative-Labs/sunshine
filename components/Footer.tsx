import React from 'react';

import styles from '../styles/Footer.module.scss';

function Footer(): JSX.Element {
  return (
    <div id={styles.footer}>
      <span id={styles['footer-tag']}>
        <p>Made with <span aria-label='heart' role='img'>❤️</span> by</p>
        <h3 className={styles.logotype}>
          CREATIVE LABS
        </h3>
      </span>
      <div id={styles['footer-nav']}>
        <nav>
          <a target='_blank' rel='noreferrer' href='https://www.facebook.com/uclacreatives'>FACEBOOK</a>
          <a target='_blank' rel='noreferrer' href='https://www.instagram.com/creativelabsucla/'>INSTAGRAM</a>
          <a target='_blank' rel='noreferrer' href='https://medium.com/creative-labs'>MEDIUM</a>
          <a target='_blank' rel='noreferrer' href='https://www.youtube.com/channel/UC917WXknuSu1IMn34PdJr3Q'>YOUTUBE</a>
          <a target='_blank' rel='noreferrer' href='https://discord.gg/vHenfGNTXJ'>DISCORD</a>
        </nav>
      </div>
    </div>
  );
}

export default Footer;
