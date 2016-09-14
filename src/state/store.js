import { createStore, applyMiddleware, compose } from 'redux';
import { routerMiddleware } from 'react-router-redux';
import thunkMiddleware from 'redux-thunk';

import reducers from './reducers';

export default function configureStore(history, initialState) {
  const reduxRouterMiddleware = routerMiddleware(history);
  let store = createStore(reducers, initialState, compose(
    applyMiddleware(
      thunkMiddleware,
      reduxRouterMiddleware
    ),

    process.env.NODE_ENV === 'development' &&
    typeof window === 'object' &&
    typeof window.devToolsExtension !== 'undefined'
      ? window.devToolsExtension()
      : f => f
  ))

  if (process.env.NODE_ENV === 'development') {
    if (module.hot) {
      module.hot.accept('./reducers', () => store.replaceReducer(require('./reducers').default))
    }
  }

  return store
}
