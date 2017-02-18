import { combineReducers } from 'redux';

import appReducer from './modules/app';

const reducers = combineReducers({
  app: appReducer
});

export default reducers;
