import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { AppContainer } from 'react-hot-loader';
import { Router, browserHistory, match } from 'react-router/es6';
import { syncHistoryWithStore } from 'react-router-redux';
import { trigger } from 'redial';

import getRoutes from './scenes';
import configureStore from './state/store';

const MOUNT_POINT = window.document.getElementById('content');
const initialState = window.__PRELOADED_STATE || {};
const store = configureStore(browserHistory, initialState);
const history = syncHistoryWithStore(browserHistory, store);
const { dispatch } = store;
const routes = getRoutes(store, history);

let render = () => {
  const { pathname, search, hash } = window.location;
  const location = `${pathname}${search}${hash}`;

  match({ routes, location }, () => {
    ReactDOM.render(
      <AppContainer>
        <Provider store={ store } key="provider">
            <Router routes={ routes } history={ history } key={ Math.random() } helpers={ { client } } />
        </Provider>
      </AppContainer>,
      MOUNT_POINT
    );

    return history.listen(location => {
      match({ routes, location }, (error, redirectLocation, renderProps) => {
        if (error) {
          console.log('==> React Router match failed.'); // eslint-disable-line no-console
        }
        const { components } = renderProps;
        const locals = {
          path: renderProps.location.pathname,
          query: renderProps.location.query,
          params: renderProps.params,
          dispatch,
          getState
        };
        if (window.__PRELOAD_STATE) {
          delete window.__PRELOAD_STATE;
        } else {
          trigger('fetch', components, locals);
        }
        trigger('defer', components, locals);
      });
    });
  });
};

const unsubscribeHistory = render();

if (module.hot) {
  module.hot.accept('./scenes/index', () => {
    unsubscribeHistory();
    setTimeout(render);
  });
}