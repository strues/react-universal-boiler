// @flow
import fetch from 'isomorphic-unfetch';
import type {
  PostsReducer,
  Action,
  Dispatch,
  GetState,
  ThunkAction,
  Reducer,
  PostsType,
} from '../../types';

type State = PostsReducer;

export const FETCH_POSTS_REQUEST = '@posts/FETCH_POSTS_REQUEST';
export const FETCH_POSTS_SUCCESS = '@posts/FETCH_POSTS_SUCCESS';
export const FETCH_POSTS_FAILURE = '@posts/FETCH_POSTS_FAILURE';

export function requestPostsStart() {
  return { type: FETCH_POSTS_REQUEST };
}

export function requestPostsDone(data: PostsType) {
  return {
    type: FETCH_POSTS_SUCCESS,
    payload: data,
  };
}

export function requestPostsFail(err: Object) {
  return {
    type: FETCH_POSTS_FAILURE,
    error: err.response.status,
  };
}

export const fetchPosts = (): ThunkAction => {
  return (dispatch: Dispatch) => {
    dispatch(requestPostsStart());
    return fetch('https://jsonplaceholder.typicode.com/posts')
      .then(r => r.json())
      .then(data => {
        return dispatch(requestPostsDone(data));
      })
      .catch(err => dispatch(requestPostsFail(err)));
  };
};

export const fetchPostsIfNeeded = (): ThunkAction => {
  return (dispatch: Dispatch, getState: GetState) => {
    const state: Reducer = getState();
    /* istanbul ignore next */
    if (state.posts.list.length === 0) {
      return dispatch(fetchPosts());
    }
    return state;
  };
};

const initialState = {
  list: [],
  isFetching: false,
  error: null,
};

export default function postsReducer(state: State = initialState, action: Action): State {
  switch (action.type) {
    case FETCH_POSTS_REQUEST:
      return {
        ...state,
        isFetching: true,
      };
    case FETCH_POSTS_SUCCESS:
      return {
        ...state,
        isFetching: false,
        list: action.payload,
      };
    case FETCH_POSTS_FAILURE:
      return {
        ...state,
        isFetching: false,
        error: action.error,
      };
    default:
      return state;
  }
}
