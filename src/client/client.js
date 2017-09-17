/* eslint-disable global-require */

import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import createHistory from 'history/createBrowserHistory';
import ConnectedRouter from 'react-router-redux/ConnectedRouter';
import configureStore from '../shared/state/store';
import App from '../shared/components/App';
import ReactHotLoader from './ReactHotLoader';

const MOUNT_POINT = document.getElementById('app');

const history = createHistory();
const preloadedState = window.__PRELOADED_STATE__;
const store = configureStore(preloadedState, history);

function renderApp() {
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
      ReactDOM.unmountComponentAtNode(MOUNT_POINT);
      reRenderApp();
    });
  });
}
renderApp();
