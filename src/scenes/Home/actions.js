import request from 'superagent';

export const FETCH_POSTS_REQUEST = 'FETCH_POSTS_REQUEST';
export const FETCH_POSTS_SUCCESS = 'FETCH_POSTS_SUCCESS';
export const FETCH_POSTS_FAILURE = 'FETCH_POSTS_FAILURE';

const requestPosts = () => {
  return { type: FETCH_POSTS_REQUEST };
};
const receivePosts = (response) => ({
  type: FETCH_POSTS_SUCCESS,
  data: response.body.results
});
const receivePostsFailed = (err) => ({
  type: FETCH_POSTS_FAILURE, error: err
});

/**
 * Function to retrieve posts from the api.
 * @return {Array} Posts returned as an array of post objects.
 */
export function fetchPosts() {
  return dispatch => {
    dispatch(requestPosts());
    return request
      .get('https://staging.boldr.io/api/v1/posts')
      .set('Accept', 'application/json')
      .then(response => {
        if (response.status === 200) {
          dispatch(receivePosts(response));
        }
      })
      .catch(err => {
        dispatch(receivePostsFailed(err));
      });
  };
}
