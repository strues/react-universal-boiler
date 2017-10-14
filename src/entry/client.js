/* eslint-disable global-require */
// @flow
import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import BrowserRouter from 'react-router-dom/BrowserRouter';
import FontFaceObserver from 'fontfaceobserver';
// internal
// $FlowIssue
import '../styles/main.scss';
import configureStore from '../state/store';
import App from '../components/App';
import AppContainer from './AppContainer';

const preloadedState = window.__PRELOADED_STATE__;
const store = configureStore(preloadedState);

const robotoObserver = new FontFaceObserver('Roboto', {});
const rubikObserver = new FontFaceObserver('Rubik', {});
// When Roboto and Rubik are loaded, fontLoaded is appended to the body
Promise.all([robotoObserver.load(), rubikObserver.load()]).then(
  () => {
    // $FlowIssue
    document.body.classList.add('fontLoaded');
  },
  () => {
    // $FlowIssue
    document.body.classList.remove('fontLoaded');
  },
);

const supportsHistory = 'pushState' in window.history;

const renderApp = App => {
  const MOUNT_POINT = document.getElementById('app');
  // in React 16 ReactDOM.render becomes ReactDOM.hydrate
  // when used for SSR.
  // $FlowIssue
  ReactDOM.hydrate(
    <AppContainer>
      <Provider store={store}>
        <BrowserRouter forceRefresh={!supportsHistory}>
          <App />
        </BrowserRouter>
      </Provider>
    </AppContainer>,
    MOUNT_POINT,
  );
};

renderApp(App);

if (module.hot && __DEV__) {
  module.hot.accept('../components/App', () => {
    const App = require('../components/App').default;
    renderApp(App);
  });
}

if (process.env.NODE_ENV === 'production') {
  const runtime = require('offline-plugin/runtime');

  runtime.install({
    onUpdateReady() {
      runtime.applyUpdate();
    },
    onUpdated() {
      window.location.reload();
    },
  });
}
