const path = require('path');
const debug = require('debug')('webpack');
const cfg = require('../config/defaults');
const dllHelpers = require('./util/dllHelpers');

const validDLLs = dllHelpers.isValidDLLs(['vendor'], path.join(__dirname, '..', 'static', 'assets'));

if (process.env.WEBPACK_DLLS === '1' && !validDLLs) {
  process.env.WEBPACK_DLLS = '0';
  debug('webpack dlls disabled');
}

const webpackConfig = require('./webpack.config.client.js')();

if (process.env.WEBPACK_DLLS === '1' && validDLLs) {
  dllHelpers.installVendorDLL(webpackConfig, 'vendor');
}

module.exports = webpackConfig;
