import fetch from 'unfetch';

export const FETCH_DATA_REQUEST = '@boldr/FETCH_DATA_REQUEST';
export const FETCH_DATA_SUCCESS = '@boldr/FETCH_DATA_SUCCESS';
export const FETCH_DATA_FAILURE = '@boldr/FETCH_DATA_FAILURE';

function requestDataStart() {
  return { type: FETCH_DATA_REQUEST };
}

function gotRequestData(data) {
  return {
    type: FETCH_DATA_SUCCESS,
    payload: data,
  };
}

function failedToGetData(err) {
  return {
    type: FETCH_DATA_FAILURE,
    error: err.response.status,
  };
}
export const getAppData = () => {
  return (dispatch, getState) => {
    dispatch(requestDataStart());
    fetch('http://jsonplaceholder.typicode.com/posts')
      .then(r => r.json())
      .then(data => {
        dispatch(gotRequestData(data));
      })
      .catch(err => dispatch(failedToGetData(err)));
  };
};

const initialState = {
  data: null,
  isFetching: false,
  error: null,
};

function appReducer(state = initialState, action) {
  switch (action.type) {
    case FETCH_DATA_REQUEST:
      return {
        ...state,
        isFetching: true,
      };
    case FETCH_DATA_SUCCESS:
      return {
        ...state,
        isFetching: false,
        data: action.payload,
      };
    case FETCH_DATA_FAILURE:
      return {
        ...state,
        isFetching: false,
        error: action.error,
      };
    default:
      return state;
  }
}

export default appReducer;
