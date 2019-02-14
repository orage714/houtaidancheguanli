import React from 'react';
import { Route, Switch } from 'react-router-dom';
import AddForm from './AddForm'

const Demo = () =>(
  <Switch>
    <Route path="/form/addForm" component={ AddForm } />
  </Switch>
);
export default Demo;