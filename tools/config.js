const path = require('path');
const fs = require('fs');

/**
 * Path of the current working directory, with symlinks taken
 * into account.
 * @type {String}
 */
const rootDir = fs.realpathSync(process.cwd());

/**
 * Get the path from the user's project root
 * @param  {String} args the path we are trying to reach
 * @return {any}      whatever it is we're looking for
 */
function resolveProject(...args) {
  return path.resolve(rootDir, ...args);
}

/**
 * Enables resolving paths via NODE_PATH.
 * Shout out to create-react-app where this was borrowed
 * https://github.com/facebookincubator/create-react-app
 * @type {String}
 */
const nodePaths = (process.env.NODE_PATH || '')
  .split(process.platform === 'win32' ? ';' : ':')
  .filter(Boolean)
  .filter(folder => !path.isAbsolute(folder))
  .map(resolveProject);

module.exports = {
  serveAssetsFrom: '/assets/',
  serverPort: 3000,
  serverHost: 'localhost',
  isVerbose: true,
  isDebug: false,
  useBabili: true,
  nodeTarget: 'current',
  rootDir,
  nodePaths,
  // <PROJECT_ROOT>/node_modules
  nodeModules: resolveProject('node_modules'),
  // <PROJECT_ROOT>/package.json
  pkgPath: resolveProject('package.json'),
  srcDir: resolveProject('src'),
  publicDir: resolveProject('public'),
  serverCompiledDir: resolveProject('build'),
  assetsDir: resolveProject('build/assets'),

  vendorFiles: [
    'react',
    'react-dom',
    'react-router-dom',
    'redux',
    'react-redux',
    'redux-thunk',
    'redux-logger',
    'react-router-redux',
    'axios',
    'styled-components',
    'react-helmet',
    'lodash',
    'hedron',
    'serialize-javascript',
  ],
};
