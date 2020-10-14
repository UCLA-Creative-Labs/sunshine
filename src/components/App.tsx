import React, { useState, useEffect } from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
} from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.min.css'

import sectionItem   from '../assets/sectionInfo.json';
import Construction  from './Construction';
import Footer        from './Footer';
import Navbar        from './Navbar';
import Section       from './Section';
import Splash        from './Splash';

import { Sheet }     from '../utils/Utils';

import colors from './styles/_variables.scss';

function App(): JSX.Element {
  const [ isDay, setIsDay ] = useState(true);
  const [ mousePos, setMousePos ] = useState<number[]>([]);
  const [ notifications, setNotifications ] = useState<Sheet[]>([]);

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

    connect_to_sheets();
  }, []);

  function connect_to_sheets() {
    window.gapi.load('client', () => window.gapi.client.init({
      apiKey: 'AIzaSyCdzmSe7AgcC3TUHKeQtOKahKYXRlmUReU',
      discoveryDocs: ["https://sheets.googleapis.com/$discovery/rest?version=v4"],
    }).then(() => load()));
  }

  function load() {
    window.gapi.client.load("sheets", "v4", () => {
      return window.gapi.client.sheets.spreadsheets.values.get({
        spreadsheetId: '11UPoREQxLhipshR4jXAGFuYfGen0WairLoxYvV9p1u4',
        range: 'Notifications!A:B',
      }).then((response: any) => formatResponse(response))
    });
  }

  function formatResponse(response: any){
    const values = response.result.values;
    if (!values) return;
    const labels = values[0];
    setNotifications(values.slice(1).map((row: string[]) => {
      var notif: Sheet = {};
      labels.map((l: string, i: number) => {
        (notif as any)[l] = row[i];
      });
      return notif;
    }));
  }

  useEffect(() => {
    notifications.map((info, i) => toast(info.notification, {
      position: 'bottom-right',
      delay: i * 1500,
      autoClose: 6000,
      onClick: () => {
        if (info.invite) {
          const win = window.open(info.invite, '_blank');
          if (win != null) win.focus();
        }
      },
    }));
  }, [notifications]);

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
                linkPath={'https://medium.com/creative-labs'}
                linkText={'View all projects on Medium ➔'} />
              <Section
                title={'Fellowship'}
                data={sectionItem.fellowship}
                linkPath={'https://bloom.creativelabsucla.com/'}
                linkText={'Bloom with Us ➔'} />
            </div>
          </Route>
          <Route path='/construction'>
            <Construction isDay={isDay} mousePos={mousePos} />
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
