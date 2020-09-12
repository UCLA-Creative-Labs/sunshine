import React from 'react';
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
  return(
    <Router>
      <Switch>
        <Route exact path='/'>
          <div style={{ margin: 0, padding: 0 }}>
            <Splash />
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
      <Navbar />
      <Footer />
    </Router>
  );
}

export default App;
