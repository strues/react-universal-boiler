import React from 'react';
import ReactDOM from 'react-dom';
import { Router, browserHistory, match } from 'react-router/es6';
import { Provider } from 'react-redux';
import { syncHistoryWithStore } from 'react-router-redux';
import { AppContainer } from 'react-hot-loader';

const MOUNT_POINT = window.document.getElementById('root');

function renderApp() {
  // As we are using dynamic react-router routes we have to use the following
  // asynchronous routing mechanism supported by the `match` function.
  // @see https://github.com/reactjs/react-router/blob/master/docs/guides/ServerRendering.md
  match({ history: browserHistory, routes }, (error, redirectLocation, renderProps) => {
    if (error) {
      routerError(error)
    } else if (redirectLocation) {
      return
    } else if (renderProps) {
      render(
        <AppContainer>
          <Provider store={ store }>
            <Router routes={ routes } history={ history } />
          </Provider>,
        </AppContainer>,
        MOUNT_POINT
      )
    }
  })
}
renderApp();