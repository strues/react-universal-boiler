import { combineReducers } from 'redux';
import { routerReducer } from 'react-router-redux';
import { reducer as reduxAsyncConnect } from 'redux-connect';

const reducers = combineReducers({
  routing: routerReducer,
  reduxAsyncConnect
});

export default reducers;