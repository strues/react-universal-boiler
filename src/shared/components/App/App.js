import React from 'react';
import Route from 'react-router-dom/Route';
import Helmet from 'react-helmet';
import Switch from 'react-router-dom/Switch';
import uuid from 'uuid';
// internal
import Layout from '../Layout';
import NotFound from '../NotFound';
import routes from '../../routes';
import '../../styles/main.scss';

function App() {
  return (
    <div>
      <Helmet titleTemplate="React Universal Boiler - %s">
        <html lang="en" />
        <title>React Universal Boiler</title>
        <meta name="application-name" content="React Universal Boiler" />
        <meta name="description" content="A server rendering React project." />
        <meta charSet="utf-8" />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="msapplication-TileColor" content="#2b2b2b" />
      </Helmet>
      <Layout>
        <Switch>
          {routes.map(({ component: Component, ...route }) => (
            // pass in the initialData from the server for this specific route
            // there is no `staticContext` on the client, so
            // we need to guard against that here
            <Route
              {...route}
              key={uuid.v4()}
              component={({ staticContext, ...props }) => <Component {...props} />}
            />
          ))}
          <Route component={NotFound} />
        </Switch>
      </Layout>
    </div>
  );
}
export default App;
