import React from 'react';
import { Switch } from 'react-router';
import { Route, Link } from 'react-router-dom';
import About from './About';
import NotFound from './NotFound';
import Posts from '../containers/Posts';

export default () => {
  return (
    <div className="App">
      <div>
        <ul>
          <li><Link to="/">Home</Link></li>
          <li><Link to="/about">About</Link></li>
        </ul>
      </div>
      <hr/>
      <Switch>
        <Route exact path="/" components={Posts}/>
        <Route exact path="/about" component={About}/>
        <Route component={NotFound}/>
      </Switch>
    </div>
  );
};
