const path = require('path');
const debug = require('debug')('webpack');
const cfg = require('../config/defaults');
const dllHelpers = require('./util/dllHelpers');

let webpackConfig;
let CSSModules = true;

const validDLLs = dllHelpers.isValidDLLs(['vendor'], path.join(__dirname, '..', 'static', 'assets'));

if (process.env.WEBPACK_DLLS === '1' && !validDLLs) {
  process.env.WEBPACK_DLLS = '0';
  debug('webpack dlls disabled');
}

if (process.env.NODE_ENV !== 'test') {
  webpackConfig = require('./webpack.config.client.js')(CSSModules);
  if (process.env.WEBPACK_DLLS === '1' && validDLLs) {
    dllHelpers.installVendorDLL(webpackConfig, 'vendor');
  }
} else {
  webpackConfig = require('./config.test')(CSSModules);
}

module.exports = webpackConfig;
