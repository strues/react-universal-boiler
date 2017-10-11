import axios from 'axios';

export const FETCH_POSTS_REQUEST = '@posts/FETCH_POSTS_REQUEST';
export const FETCH_POSTS_SUCCESS = '@posts/FETCH_POSTS_SUCCESS';
export const FETCH_POSTS_FAILURE = '@posts/FETCH_POSTS_FAILURE';

export function requestPostsStart() {
  return { type: FETCH_POSTS_REQUEST };
}

export function requestPostsDone(data) {
  return {
    type: FETCH_POSTS_SUCCESS,
    payload: data,
  };
}

export function requestPostsFail(err) {
  return {
    type: FETCH_POSTS_FAILURE,
    error: err.response.status,
  };
}

export const fetchPosts = () => {
  return dispatch => {
    dispatch(requestPostsStart());
    return axios
      .get('https://jsonplaceholder.typicode.com/posts')
      .then(res => {
        /* istanbul ignore next */
        const { data } = res;
        /* istanbul ignore next */
        return dispatch(requestPostsDone(data));
      })
      .catch(err => dispatch(requestPostsFail(err)));
  };
};

export const fetchPostsIfNeeded = () => {
  return (dispatch, getState) => {
    const state = getState();
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

export default function postsReducer(state = initialState, action) {
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
