import React from 'react';
import { Route, Switch } from 'react-router-dom';
import AddForm from './AddForm'
import FormLogin from './login'
import FormRegister from './register'

const Form = () =>(
  <Switch>
    <Route path="/form/login" component={FormLogin} />
     <Route path="/form/reg" component={FormRegister} />
    <Route path="/form/addForm" component={ AddForm } />

  </Switch>
);
export default Form;