import { combineReducers } from 'redux';
import postsReducer from './modules/posts';

const rootReducer = combineReducers({
  posts: postsReducer,
});

export default rootReducer;
