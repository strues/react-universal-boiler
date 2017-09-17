import { combineReducers } from 'redux';
import { routerReducer } from 'react-router-redux';
import postsReducer from './modules/posts';

const appReducer = combineReducers({
  posts: postsReducer,
  router: routerReducer,
});

const rootReducer = (state, action) => {
  if (action.type === 'RESET') {
    state = undefined;
  }

  return appReducer(state, action);
};

export default rootReducer;
