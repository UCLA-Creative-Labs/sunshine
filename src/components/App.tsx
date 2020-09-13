import React, { useState, useEffect } from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
} from 'react-router-dom';

import sectionItem from '../assets/sectionInfo.json';
import Footer      from './Footer';
import Navbar      from './Navbar';
import Section     from './Section';
import Splash      from './Splash';

import './styles/App.scss';

function App(): React.Component {
  const [ isDay, setIsDay ] = useState(true);
  const [ mousePos, setMousePos ] = useState(null);

  const onMouseMove = e => {
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
  }, []);

  return(<div onMouseMove={onMouseMove}>
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
              linkText={'View all projects on Medium ➔'} />
            <Section
              title={'Fellowship'}
              data={sectionItem.fellowship}
              linkText={'Read more + apply ➔'} />
          </div>
        </Route>
      </Switch>
      <Navbar isDay={isDay} />
      <Footer />
    </Router>
  </div>);
}

export default App;
