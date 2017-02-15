const path = require('path');
const WebpackIsomorphicTools = require('webpack-isomorphic-tools');

const ROOT_DIR = path.resolve(__dirname, '..');

global.__CLIENT__ = false;
global.__SERVER__ = true;
global.__DISABLE_SSR__ = false;
global.__DEV__ = process.env.NODE_ENV !== 'production';
global.__DLLS__ = process.env.WEBPACK_DLLS === '1';

global.webpackIsomorphicTools = new WebpackIsomorphicTools(require('../tools/webpack/util/isomorphic.config'))
  .server(ROOT_DIR, () => {
    require('../src/server.js');
  });
