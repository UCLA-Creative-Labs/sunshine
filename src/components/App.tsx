import React from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
} from 'react-router-dom';

import About      from './About';
import Fellowship from './Fellowship';
import Footer     from './Footer';
import Navbar     from './Navbar';
import Projects   from './Projects';
import Splash     from './Splash';

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
