/* eslint-disable global-require */

import React from 'react';
import { render, unmountComponentAtNode } from 'react-dom';
import { Provider } from 'react-redux';
import createHistory from 'history/createBrowserHistory';
import ConnectedRouter from 'react-router-redux/ConnectedRouter';
import WebFontLoader from 'webfontloader';

import configureStore from './state/store';
import ReactHotLoader from './util/ReactHotLoader';
import App from './components/App';

WebFontLoader.load({
  google: { families: ['Rubik:300,400,700'] },
});

const MOUNT_POINT = document.getElementById('app');

const history = createHistory();
const preloadedState = window.__PRELOADED_STATE__;
const store = configureStore(preloadedState, history);

function renderApp(TheApp) {
  render(
    <ReactHotLoader>
      <Provider store={store}>
        <ConnectedRouter history={history}>
          <App />
        </ConnectedRouter>
      </Provider>
    </ReactHotLoader>,
    MOUNT_POINT,
  );
}

if (module.hot) {
  const reRenderApp = () => {
    try {
      renderApp(require('./components/App'));
    } catch (error) {
      const RedBox = require('redbox-react').default;

      render(<RedBox error={error} />, MOUNT_POINT);
    }
  };
  module.hot.accept('./components/App', () => {
    setImmediate(() => {
      // Preventing the hot reloading error from react-router
      unmountComponentAtNode(MOUNT_POINT);
      reRenderApp();
    });
  });
}
renderApp();
