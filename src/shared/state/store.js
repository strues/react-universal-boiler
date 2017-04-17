import { createStore, applyMiddleware, compose } from 'redux';
import thunkMiddleware from 'redux-thunk';
import { logger } from 'redux-logger';
import rootReducer from './reducers';

const inBrowser = typeof window === 'object';

export default function configureStore(preloadedState, history) {
  const middleware = [thunkMiddleware, logger];

  const enhancers = [applyMiddleware(...middleware)];

  /* istanbul ignore next */
  const devEnhancers = process.env.NODE_ENV !== 'production' &&
    inBrowser &&
    window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__
    ? window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__
    : compose;

  // Creating the store
  const store = createStore(
    rootReducer,
    preloadedState,
    devEnhancers(...enhancers),
  );
  if (process.env.NODE_ENV === 'development' && module.hot) {
    module.hot.accept('./reducers', () => {
      const nextRootReducer = require('./reducers').default; // eslint-disable-line

      store.replaceReducer(nextRootReducer);
    });
  }

  return store;
}
