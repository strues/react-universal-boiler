import React from 'react';
import { Provider } from 'react-redux';
import ReactDOM from 'react-dom';
import WebFontLoader from 'webfontloader';

import Root from '../shared/components/Root';
import App from '../shared/components/App';
import configureStore from '../shared/state/store';
import '../shared/theme/main.scss';

// The element React looks for to mount
const MOUNT_POINT = window.document.getElementById('content');
// initialState is serialized on the window for the client-side to grab
// once rendering takes place.
const isDev = __DEV__; // eslint-disable-line
const preloadedState = window.__PRELOADED_STATE__;
const store = configureStore(preloadedState);

WebFontLoader.load({
  google: { families: ['Open Sans:300,400,700'] }
});

ReactDOM.render(
  <Provider store={store}>
    <Root server={false}>
      <App />
    </Root>
  </Provider>, MOUNT_POINT);

if (module.hot) {
  module.hot.accept('../shared/components/App', () => {
    const NextApp = require('../shared/components/App').default;
    ReactDOM.render(
      <Provider store={store}>
        <Root server={false}>
          <NextApp />
        </Root>
      </Provider>, MOUNT_POINT);
  });
}
