import { FETCH_POSTS_REQUEST, FETCH_POSTS_SUCCESS, FETCH_POSTS_FAILURE } from './actions';

const INITIAL_STATE = {
  loaded: false,
  error: null,
  data: [],
  pagination: {}
};

/**
 * Blog Reducer
 * @param  {Object} state       The initial state
 * @param  {Object} action      The action object
 */
export default function postsReducer(state = INITIAL_STATE, action = {}) {
  switch (action.type) {
    case FETCH_POSTS_REQUEST:
      return {
        ...state,
        loading: true
      };
    case FETCH_POSTS_SUCCESS:
      return {
        ...state,
        loading: false,
        loaded: true,
        pagination: action.pagination,
        data: action.data
      };
    case FETCH_POSTS_FAILURE:
      return {
        ...state,
        loading: false,
        loaded: false,
        error: action.error
      };
    default:
      return state;
  }
}
