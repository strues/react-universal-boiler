const errorLoading = (err) => {
  console.error('Dynamic page loading failed', err); // eslint-disable-line no-console
};

const loadModule = (cb) => (componentModule) => {
  cb(null, componentModule.default);
};

export default (store) => {
  const connect = (fn) => (nextState, replaceState) => fn(store, nextState, replaceState);
  if (typeof require.ensure !== 'function') require.ensure = (deps, cb) => cb(require);

  return {
    path: '/',
    component: require('./App').default,
    indexRoute: {
      component: require('./Home').default
    }
  };
};
