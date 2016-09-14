import { combineReducers } from 'redux';
import { routerReducer } from 'react-router-redux';

import lastfmReducer from '../scenes/LastFM/reducer';

const reducers = combineReducers({
  routing: routerReducer,
  lastfm: lastfmReducer
});

export default reducers;
