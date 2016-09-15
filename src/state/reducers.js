import { combineReducers } from 'redux';
import { routerReducer } from 'react-router-redux';

import postsReducer from 'scenes/Home/reducer';

const reducers = combineReducers({
  routing: routerReducer,
  posts: postsReducer
});

export default reducers;
