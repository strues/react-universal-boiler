import { createStore, applyMiddleware, compose } from 'redux';
import { routerMiddleware } from 'react-router-redux';
import thunkMiddleware from 'redux-thunk';

import reducers from './reducers';

export default function configureStore(history, initialState) {
  // Redux middleware
  const reduxRouterMiddleware = routerMiddleware(history);
  const middleware = [thunkMiddleware, reduxRouterMiddleware];

  // Development enhancers
  const enhancers = [];

  if (__DEV__ && typeof window === 'object') {
    const devToolsExtension = window.devToolsExtension;
    if (typeof devToolsExtension === 'function') {
      enhancers.push(devToolsExtension());
    }
  }

  // Creating the store
  const store = createStore(reducers, initialState, compose(
    applyMiddleware(...middleware),
    ...enhancers
  ));

  // Hot reload
  if (process.env.NODE_ENV === 'development') {
    if (module.hot) {
      module.hot.accept('./reducers', () => store.replaceReducer(require('./reducers').default));
    }
  }

  return store;
}
