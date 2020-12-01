/* eslint @typescript-eslint/no-explicit-any: 0 */
import React, { useState, useEffect } from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
} from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.min.css';

import notifications from '../assets/notifications.json';
import sectionItem   from '../assets/sectionInfo.json';

import { openWindow, Person, query } from '../utils/Utils';

import Construction  from './Construction';
import Footer        from './Footer';
import Join          from './Join';
import Navbar        from './Navbar';
import Section       from './Section';
import Splash        from './Splash';
import Team          from './Team';

import colors from './styles/_variables.scss';

function App(): JSX.Element {
  const [ isDay, setIsDay ] = useState(true);
  const [ mousePos, setMousePos ] = useState<number[]>([]);
  const [team, setTeam] = useState<Person[]>([]);

  const onMouseMove = (e: React.MouseEvent) => {
    setMousePos([ e.clientX, e.clientY ]);
  };

  useEffect(() => {
    const now = new Date();
    const getIsDayDefault = () => {
      const defaultSunrise = new Date(), defaultSunset = new Date();
      defaultSunrise.setHours(6);
      defaultSunset.setHours(20);
      setIsDay(now >= defaultSunrise && now <= defaultSunset);
    };

    navigator.geolocation.getCurrentPosition(pos => {
      const { latitude, longitude } = pos.coords;
      fetch(`https://api.sunrise-sunset.org/json?lat=${latitude}&lng=${longitude}&formatted=0`)
        .then(res => res.json())
        .then(data => {
          const sunrise = new Date(data.results.sunrise), sunset  = new Date(data.results.sunset);
          setIsDay(now >= sunrise && now <= sunset);
        })
        .catch(() => { getIsDayDefault(); });
    }, () => { getIsDayDefault(); });

    notifications.map((info, i) => toast(info.notification, {
      position: 'bottom-right',
      delay: i * 1500,
      autoClose: 6000,
      onClick: () => {
        if (info.invite) openWindow(info.invite);
      },
    }));

    void window.fetch(`https://graphql.contentful.com/content/v1/spaces/${process.env.SPACE_ID}/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.CONTENTFUL_ACCESS_TOKEN}`,
      },
      body: JSON.stringify({query}),
    }).then((res) => res.json())
      .then(({data, error}) => {
        if (error) return;
        setTeam(data.teamMembersCollection.items.map((person: any) => {
          person.image = person?.photo?.url ?? '/assets/winter.svg';
          person.link = person.website ? person.website : person.instagram;
          return person;
        }));
      });
  }, []);

  useEffect(() => {
    // For Safari browsers
    if (isDay) document.body.style.backgroundColor = colors.splashBgDay;
    else document.body.style.backgroundColor = colors.splashBgNight;
  }, [ isDay ]);

  return(
    <div id='app' onMouseMove={onMouseMove}>
      <Router>
        <Switch>
          <Route exact path='/'>
            <div style={{ margin: 0, padding: 0 }}>
              <Splash isDay={isDay} mousePos={mousePos} />
              <Section
                title={'About'}
                data={sectionItem.about} />
              <Section
                title={'Projects'}
                data={sectionItem.projects}
                body={'Every quarter we have student teams collaborate and execute an idea.' +
                      ' Below are some projects that were created in the past quarters.'}
                linkPath={'https://medium.com/creative-labs'}
                linkText={'View all projects on Medium ➔'} />
              <Section
                title={'Fellowship'}
                data={sectionItem.fellowship}
                body={'We\'ve teamed up with other clubs at UCLA to bring you classes that teach' +
                      ' you how to create your own web project from start to finish.'}
                linkPath={'https://bloom.creativelabsucla.com/'}
                linkText={'Bloom with Us ➔'} />
            </div>
          </Route>
          <Route path='/join'>
            <Join />
          </Route>
          <Route path='/construction'>
            <Construction isDay={isDay} mousePos={mousePos} />
          </Route>
          <Route path='/team'>
            <Team data={team} />
          </Route>
        </Switch>
        <Navbar isDay={isDay} />
        <ToastContainer />
        <Footer />
      </Router>
    </div>
  );
}

export default App;
