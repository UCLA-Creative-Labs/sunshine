import React from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from 'react-router-dom';

import Navbar     from './Navbar';
import Splash     from './Splash';
import About      from './About';
import Projects   from './Projects';
import Fellowship from './Fellowship';
import Footer     from './Footer';

import './styles/App.scss';

function App(): React.Component {
  return(
    <Router>
      <Switch>
        <Route exact path='/'>
          <div style={{ margin: 0, padding: 0 }}>
            <Splash />
            <About />
            <Projects />
            <Fellowship />
          </div>
        </Route>
      </Switch>
      <Navbar />
      <Footer />
    </Router>
  );
}

export default App;
