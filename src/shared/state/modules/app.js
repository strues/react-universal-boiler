import request from 'superagent';

export const FETCH_DATA_REQUEST = '@boldr/FETCH_DATA_REQUEST';
export const FETCH_DATA_SUCCESS = '@boldr/FETCH_DATA_SUCCESS';
export const FETCH_DATA_FAILURE = '@boldr/FETCH_DATA_FAILURE';

function requestDataStart() {
  return {
    type: FETCH_DATA_REQUEST
  };
}

function gotRequestData(res) {
  return {
    type: FETCH_DATA_SUCCESS,
    payload: res.body,
  };
}

function failedToGetData(err) {
  return {
    type: FETCH_DATA_FAILURE,
    error: err.response.status
  };
}
export const getAppData = () => {
  return (dispatch, getState) => {
    dispatch(requestDataStart());
    return request
      .get('https://staging.boldr.io/api/v1/posts?include=[author,tags,comments]')
      .set('Accept', 'application/json')
      .then(res => dispatch(gotRequestData(res)))
      .catch(err => dispatch(failedToGetData(err.response.status)));
  };
};

const initialState = {
  data: null,
  loading: false,
  error: null
};

function appReducer(state = initialState, { type, payload }) {
  switch (type) {
    case FETCH_DATA_REQUEST:
      return Object.assign({}, state, {
        loading: true
      });
    case FETCH_DATA_SUCCESS:
      return Object.assign({}, state, {
        loading: false,
        data: payload
      });
    case FETCH_DATA_FAILURE:
      return Object.assign({}, state, {
        loading: false,
        error: payload
      });
    default:
      return Object.assign({}, state, {

      });
  }
}

export default appReducer;
