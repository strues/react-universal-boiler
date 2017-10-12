import { createStore, applyMiddleware, compose } from 'redux';
import thunkMiddleware from 'redux-thunk';
import axios from 'axios';
import rootReducer from './reducers';

// This enables Redux Dev Tools chrome extension if it is available on the window.
// I've also blacklisted redux-form actions (it isnt installed here) but, i find the
// constant blur spam annoying.
// If Redux Dev Tools arent used, the regular compose function is used instead.
/* istanbul ignore next */
const composeEnhancers =
  typeof window === 'object' && window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__
    ? window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__({
        actionsBlacklist: [
          '@@redux-form/CHANGE',
          '@@redux-form/BLUR',
          '@@redux-form/FOCUS',
          '@@redux-form/UNREGISTER_FIELD',
          '@@redux-form/REGISTER_FIELD',
        ],
      })
    : compose;

/**
 * Configure the redux store for the application
 *
 * @export configureStore
 * @param {Object} preloadedState  the initial state hydrated from the server or window
 * @param {Object} history  Either memory history (server) or browser history
 * @return {Object} store
 */
export default function configureStore(preloadedState, history) {
  const middleware = [thunkMiddleware.withExtraArgument(axios)];

  // Here we only want to include redux-logger during development.
  /* istanbul ignore next */
  if (process.env.NODE_ENV == 'development' && process.env.TARGET === 'web') {
    middleware.push(require('redux-logger').createLogger({ collapsed: true }));
  }
  const enhancers = [applyMiddleware(...middleware)];

  // Creating the store
  const store = createStore(rootReducer, preloadedState, composeEnhancers(...enhancers));
  /* istanbul ignore next */
  if (process.env.NODE_ENV == 'development' && module.hot) {
    module.hot.accept('./reducers', () => {
      const nextRootReducer = require('./reducers').default; // eslint-disable-line

      store.replaceReducer(nextRootReducer);
    });
  }

  return store;
}
