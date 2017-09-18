import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import moxios from 'moxios';
import sinon from 'sinon';

import postsReducer, {
  FETCH_POSTS_REQUEST,
  FETCH_POSTS_FAILURE,
  FETCH_POSTS_SUCCESS,
  fetchPosts,
  fetchPostsIfNeeded,
  requestPostsStart,
  requestPostsDone,
  requestPostsFail,
} from './posts';

describe('postsReducer', () => {
  it('should return the initial state', () => {
    expect(postsReducer(undefined, {})).toEqual({
      list: [],
      isFetching: false,
      error: null,
    });
  });
  it('should start fetching posts', () => {
    const initialState = {
      list: [],
      isFetching: false,
      error: null,
    };
    const stateAfter = {
      list: [],
      isFetching: true,
      error: null,
    };
    expect(
      postsReducer(initialState, {
        type: FETCH_POSTS_REQUEST,
      }),
    ).toEqual(stateAfter);
  });
  it('should handle successfully fetching posts', () => {
    const fixture = [{ id: 1, title: 'abc', body: 'def' }, { id: 2, title: 'ghi', body: 'jkl' }];
    const initialState = {
      list: [],
      isFetching: true,
      error: null,
    };
    const stateAfter = {
      list: [{ id: 1, title: 'abc', body: 'def' }, { id: 2, title: 'ghi', body: 'jkl' }],
      isFetching: false,
      error: null,
    };

    expect(
      postsReducer(initialState, {
        type: FETCH_POSTS_SUCCESS,
        payload: fixture,
      }),
    ).toEqual(stateAfter);
  });
  it('should handle post fetching errors', () => {
    const initialState = {
      list: [],
      isFetching: true,
      error: null,
    };
    const stateAfter = {
      list: [],
      isFetching: false,
      error: undefined,
    };
    expect(
      postsReducer(initialState, {
        type: FETCH_POSTS_FAILURE,
        error: undefined,
      }),
    ).toEqual(stateAfter);
  });
});

describe('postsReducer actions', () => {
  beforeEach(() => {
    moxios.install();
  });

  afterEach(() => {
    moxios.uninstall();
  });
  it('should dispatch the correct action to begin fetching posts', () => {
    const mockStore = configureMockStore([thunk]);
    const store = mockStore({
      posts: {
        list: [],
        isFetching: false,
        error: null,
      },
    });
    store.dispatch(requestPostsStart());
    const action = store.getActions()[0];
    expect(action).toEqual({
      type: '@posts/FETCH_POSTS_REQUEST',
    });
  });
  it('should dispatch the correct action on a successful posts fetch', () => {
    const mockStore = configureMockStore([thunk]);
    const fixture = [{ id: 1, title: 'abc', body: 'def' }, { id: 2, title: 'ghi', body: 'jkl' }];
    const store = mockStore({
      posts: {
        list: [],
        isFetching: false,
        error: null,
      },
    });
    store.dispatch(requestPostsDone(fixture));
    const action = store.getActions()[0];
    expect(action).toEqual({
      type: '@posts/FETCH_POSTS_SUCCESS',
      payload: fixture,
    });
  });
  it('should dispatch the correct action on a posts fetch failure', () => {
    const mockStore = configureMockStore([thunk]);
    const errorFixture = {
      response: {
        status: 404,
      },
    };
    const store = mockStore({
      posts: {
        list: [],
        isFetching: true,
        error: null,
      },
    });
    store.dispatch(requestPostsFail(errorFixture));
    const action = store.getActions()[0];
    expect(action).toEqual({
      type: '@posts/FETCH_POSTS_FAILURE',
      error: 404,
    });
  });
  it('should handle a thunk api request', () => {
    const mockStore = configureMockStore([thunk]);
    const store = mockStore({
      posts: {
        list: [],
        isFetching: false,
        error: null,
      },
    });
    const expectedPosts = [
      { id: 1, title: 'abc', body: 'def' },
      { id: 2, title: 'ghi', body: 'jkl' },
    ];

    moxios.stubRequest('https://jsonplaceholder.typicode.com/posts', {
      status: 200,
      response: expectedPosts,
    });

    store.dispatch(fetchPosts());
    const action = store.getActions()[0];
    expect(action).toEqual({
      type: '@posts/FETCH_POSTS_REQUEST',
    });
  });
  it('should not dispatch an action if there is already a populated store', () => {
    const mockStore = configureMockStore([thunk]);
    const store = mockStore({
      posts: {
        list: [{ id: 1, title: 'abc', body: 'def' }, { id: 2, title: 'ghi', body: 'jkl' }],
        isFetching: false,
        error: null,
      },
    });
    store.dispatch(fetchPostsIfNeeded());
    const action = store.getActions()[0];
    expect(action).toBeUndefined();
  });
});
