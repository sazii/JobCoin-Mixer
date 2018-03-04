import React, { Component } from 'react';
import { Route, HashRouter as Router } from 'react-router-dom';
import Mixer from './Mixer';
import TakeAddresses from './TakeAddresses';

export default class Main extends Component {

  render () {
    return (
      <Router>
      <div id="root" className="container-fluid">
        <div className="col-xs-10">
           <Route exact path="/" component={TakeAddresses} />
           <Route path="/mixerLogs/:depositAddress" component={Mixer} />
        </div>
      </div>
      </Router>
    );
  }
}
