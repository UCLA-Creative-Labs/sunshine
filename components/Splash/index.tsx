import Link from 'next/link';
import React, { useContext } from 'react';
import { AppContext } from '../../pages/_app';
import colors from '../../styles/_variables.module.scss';
import styles from '../../styles/Splash.module.scss';
import { ILink } from '../../utils';

interface SplashProps {
  heading: string;
  description: string;
  children: JSX.Element;
  buttons?: ILink[];
  halve?: boolean;
}

function Splash(props: SplashProps): JSX.Element {
  const {heading, description, children, buttons, halve} = props;
  const {isDay} = useContext(AppContext);

  const splashClass = !halve ? (isDay ? styles.day : styles.night) : '';
  const containerStyle = halve && { height: '50vh', minHeight: 'unset', backgroundColor: colors.lightBlue };
  const blurbStyle = halve && { bottom: '0px'};

  return (
    <div id={styles.splash} className={['section', splashClass].join(' ')} style={containerStyle}>
      <div>
        {children}
        <div id={styles.blurb} style={blurbStyle}>
          <h1 id={styles.heading}>
            {heading}
          </h1>
          <p id={styles.description}>
            {description}
          </p>
          {buttons &&
            <div id={styles['btn-container']}>
              {buttons.map(({url, displayText}) =>
                <Link href={url} key={displayText}>
                  <button className={styles.btn}>{displayText}</button>
                </Link>,
              )}
            </div>
          }
        </div>
      </div>
    </div>
  );
}

export default Splash;
