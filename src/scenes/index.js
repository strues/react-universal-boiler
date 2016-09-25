// polyfill to use require.ensure. Require.ensure is an alternative to System.import
if (typeof require.ensure !== 'function') require.ensure = (deps, cb) => cb(require);

const errorLoading = (err) => {
  console.error('Dynamic page loading failed', err); // eslint-disable-line no-console
};

const loadModule = (cb) => (componentModule) => {
  cb(null, componentModule.default);
};

export default (store) => {
  const connect = (fn) => (nextState, replaceState) => fn(store, nextState, replaceState);

  return {
    path: '/',
    component: require('./App').default,
    indexRoute: {
      component: require('./Home').default
    },
    childRoutes: [
      // {
      //   path: 'about',
      //   getComponent(nextState, cb) {
      //     System.import('./About')
      //       .then(loadModule(cb))
      //       .catch(errorLoading);
      //   }
      // }
    ]
  };
};
