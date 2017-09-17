/* eslint-disable global-require */

import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import createHistory from 'history/createBrowserHistory';
import ConnectedRouter from 'react-router-redux/ConnectedRouter';
import configureStore from '../shared/state/store';
import App from '../shared/components/App';
import ReactHotLoader from './ReactHotLoader';

const history = createHistory();
const preloadedState = window.__PRELOADED_STATE__;
const store = configureStore(preloadedState, history);

const renderApp = App => {
  const MOUNT_POINT = document.getElementById('app');
  // in React 16 ReactDOM.render becomes ReactDOM.hydrate
  // when used for SSR.
  ReactDOM.hydrate(
    <ReactHotLoader>
      <Provider store={store}>
        <ConnectedRouter history={history}>
          <App />
        </ConnectedRouter>
      </Provider>
    </ReactHotLoader>,
    MOUNT_POINT,
  );
};

renderApp(App);

if (module.hot && process.env.NODE_ENV === 'development') {
  module.hot.accept('../shared/components/App', () => {
    const App = require('../shared/components/App').default;
    renderApp(App);
  });
}
