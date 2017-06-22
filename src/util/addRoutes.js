import React from 'react';
import { object, array } from 'prop-types';
import Route from 'react-router-dom/Route';
import Switch from 'react-router-dom/Switch';
import Redirect from 'react-router-dom/Redirect';
import uuid from 'uuid';

const renderRoute = (store, route, props) => {
  return <route.component {...props} route={route} />;
};

renderRoute.propTypes = {
  staticContext: object,
};

renderRoute.defaultProps = {
  staticContext: null,
};

const RouteManager = (props, context) => (
  <Switch>
    {props.routes.map(route => (
      <Route
        key={Math.random()}
        path={route.path}
        render={props => renderRoute(context.store, route, props)}
        exact={route.exact}
        strict={route.strict}
      />
    ))}
  </Switch>
);

RouteManager.propTypes = {
  routes: array.isRequired,
};

RouteManager.contextTypes = {
  store: object,
};

export default routes => {
  if (!routes) {
    return null;
  }

  return <RouteManager routes={routes} />;
};
