import React from 'react';
import { Route, Switch } from 'react-router-dom';
import Shop from './Shop'

const Demo = () =>(
  <Switch>
    <Route path="/demo/shop" component={ Shop } />
  </Switch>
);

export default Demo;