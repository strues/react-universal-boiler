import configureStore from './store';

describe('confingureStore', () => {
  let store;
  const preloadedState = {};
  beforeAll(() => {
    store = configureStore(preloadedState, {});
  });
  it('should have a store', () => {
    expect(store).toBeDefined();
    expect(typeof store).toBe('object');
    expect(typeof store.dispatch).toBe('function');
    expect(typeof store.subscribe).toBe('function');
    expect(typeof store.getState).toBe('function');
  });
});
