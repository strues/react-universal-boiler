import rootReducer from './reducers';

describe('rootReducer', () => {
  it('Should return the initial state', () => {
    expect(rootReducer(undefined, {})).toEqual({
      posts: {
        list: [],
        isFetching: false,
        error: null,
      },
      router: {
        location: null,
      },
    });
  });
});
