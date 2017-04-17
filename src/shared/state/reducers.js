import { combineReducers } from 'redux';
import appReducer from './modules/app';
import { routerReducer as routing } from 'react-router-redux';

const rootReducer = combineReducers({
  app: appReducer,
  routing,
});

export default rootReducer;
