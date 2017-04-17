/* @flow */
/* eslint-disable global-require */

import React from 'react';
import { render, unmountComponentAtNode } from 'react-dom';
import { Provider } from 'react-redux';
import createHistory from 'history/createBrowserHistory';
import ConnectedRouter from 'react-router-redux/ConnectedRouter';
import renderRoutes from 'react-router-config/renderRoutes';
import WebFontLoader from 'webfontloader';

import routes from '../shared/routes';
import configureStore from '../shared/state/store';
import ReactHotLoader from './ReactHotLoader';

WebFontLoader.load({
  google: { families: ['Rubik:300,400,700'] },
});

const MOUNT_POINT = document.getElementById('app');

const history = createHistory();
const preloadedState = window.__PRELOADED_STATE__;
const store = configureStore(preloadedState, history);

function renderApp(BoldrApp) {
  render(
    <ReactHotLoader>
      <Provider store={store}>
        <ConnectedRouter history={history}>
          {renderRoutes(routes)}
        </ConnectedRouter>
      </Provider>
    </ReactHotLoader>,
    MOUNT_POINT,
  );
}
if (process.env.NODE_ENV !== 'production') {
  window.React = React;
}
if (module.hot) {
  const reRenderApp = () => {
    try {
      renderApp(require('../shared/routes'));
    } catch (error) {
      const RedBox = require('redbox-react').default;

      render(<RedBox error={error} />, MOUNT_POINT);
    }
  };
  module.hot.accept('../shared/routes', () => {
    setImmediate(() => {
      // Preventing the hot reloading error from react-router
      unmountComponentAtNode(MOUNT_POINT);
      reRenderApp();
    });
  });
}
renderApp();
