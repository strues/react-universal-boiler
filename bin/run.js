#!/usr/bin/env node

const path = require('path');
const WebpackIsomorphicTools = require('webpack-isomorphic-tools');

const isomorphicConfig = require('../tools/webpack/util/isomorphic.config');

const ROOT_DIR = path.resolve(process.cwd());

global.__CLIENT__ = false;
global.__SERVER__ = true;
global.__DISABLE_SSR__ = false;
global.__DEV__ = false;
global.__DLLS__ = process.env.WEBPACK_DLLS === '1';


global.webpackIsomorphicTools = new WebpackIsomorphicTools(isomorphicConfig)
  .server(ROOT_DIR, () => {
    require('../static/server.js');
  });
