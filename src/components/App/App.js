import React, { Component } from 'react';
import Route from 'react-router-dom/Route';
import Helmet from 'react-helmet';
import Switch from 'react-router-dom/Switch';
import Redirect from 'react-router-dom/Redirect';
import uuid from 'uuid';
import { connect } from 'react-redux';
import { object } from 'prop-types';
import { injectGlobal } from 'styled-components';
import Layout from '../Layout';
import NotFound from '../NotFound';
import routes from '../../routes';
import '../../styles/main.scss';

injectGlobal`
  body {
    font-family: sans-serif;
    margin: 0;
  }
`;
const App = props => (
  <Layout>
    <div>
      <Switch>
        {routes.map(route => (
          // pass in the initialData from the server for this specific route
          <Route {...route} key={uuid.v4()} />
        ))}
        <Route component={NotFound} />
      </Switch>
    </div>
  </Layout>
);

export default App;
