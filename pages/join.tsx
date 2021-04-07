import React from 'react';
import Layout from '../components/Layout';
import joinItem from '../public/joinInfo.json';
import styles from '../styles/Join.module.scss';

function Join(): JSX.Element {
  return (
    <Layout>
      <div className={styles['join-page']}>
        <div>
          <h1>{joinItem.title_1}</h1>
          <p className={styles['join-body']}>{joinItem.body_1}</p>
          <a className={styles['section-link-text']} href='#roles'>
            VIEW ROLES ➔
          </a>
        </div>
        <div>
          <h1>{joinItem.title_2}</h1>
          <p className={styles['join-body']}>{joinItem.body_2}</p>
          <div className={[styles.indented, styles['join-body']].join(' ')}>
            <p>
              (1) <strong>Workshops:</strong> Anyone can attend workshops! We
              teach a variety of topics from basic design skills to illustration.
            </p>
            <p>
              (2) <strong>Events:</strong> Anyone can attend events! Famous
              professionals drop by to talk about their passions and companies
              come with recruitment opportunities.
            </p>
            <p>
              (3) <strong>Projects:</strong> Students must apply to projects as
              either a Lead or Member. Together, everyone will work to complete a
              project by the end of the quarter. To find out more about our
              projects, visit our{' '}
              <a
                target='_blank'
                rel='noreferrer'
                href='https://medium.com/creative-labs'
                className='underlined'
              >
                Medium
              </a>
              .
            </p>
          </div>
        </div>
        <div id={'roles'} className={styles['join-roles']}>
          <h1>Roles</h1>
          <div className={styles['role-cards']}>
            {joinItem.roles.map((role) => (
              <div key={role.title} className={styles['role-card']}>
                <div className={styles['role-img-container']}>
                  <img className={styles['role-img']} src={role.image} alt={role.image}/>
                </div>
                <h3>{role.title}</h3>
                <h4>{role.subtitle}</h4>
                <p>{role.body}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Layout>
  );
}

export default Join;