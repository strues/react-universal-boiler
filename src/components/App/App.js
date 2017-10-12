import React from 'react';
import Route from 'react-router-dom/Route';
import Helmet from 'react-helmet';
import Switch from 'react-router-dom/Switch';
import uuid from 'uuid';
// internal
import Layout from '../Layout';
import NotFound from '../NotFound';
import routes from '../../routes';

const App = () => (
  <div>
    <Helmet titleTemplate="%s | React Universal Boiler" defaultTitle="React Universal Boiler">
      <meta charSet="utf-8" />
      <html lang="en" />
      <meta name="application-name" content="React Universal Boiler" />
      <meta name="description" content="A server rendering React project." />

      <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <meta name="msapplication-TileColor" content="#2b2b2b" />
    </Helmet>
    <Layout>
      <Switch>
        {routes.map(({ component: Component, ...route }) => (
          <Route
            {...route}
            key={uuid.v4()}
            component={({ ...props }) => <Component {...props} />}
          />
        ))}
        <Route component={NotFound} />
      </Switch>
    </Layout>
  </div>
);

export default App;
