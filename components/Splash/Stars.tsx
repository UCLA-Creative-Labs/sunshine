import React, { useContext } from 'react';

import { AppContext } from '../../pages/_app';
import styles from '../../styles/Stars.module.scss';

function Stars(): JSX.Element {
  const {isDay} = useContext(AppContext);

  if (isDay) {
    return <></>;
  }

  return (
    <div id={styles['star-container']}>
      <div className={styles.star}/>
      <div className={styles.star}/>
      <div className={styles.star}/>
      <div className={styles.star}/>
      <div className={styles.star}/>
    </div>
  )
}

export default Stars;
