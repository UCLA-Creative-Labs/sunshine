import React from 'react';
import styles from '../../styles/Stars.module.scss';

function Stars(): JSX.Element {

  return (
    <div id={styles['star-container']}>
      <div className={styles.star}/>
      <div className={styles.star}/>
      <div className={styles.star}/>
      <div className={styles.star}/>
      <div className={styles.star}/>
    </div>
  );
}

export default Stars;
