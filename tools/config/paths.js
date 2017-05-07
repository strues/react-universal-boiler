import path from 'path';
import fs from 'fs';

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
 * Enables resolving paths via NODE_PATH. Shout out to create-react-app
 * https://github.com/facebookincubator/create-react-app/blob/master/packages/react-scripts/config/paths.js#L24
 * @type {String}
 */
const nodePaths = (process.env.NODE_PATH || '')
  .split(process.platform === 'win32' ? ';' : ':')
  .filter(Boolean)
  .filter(folder => !path.isAbsolute(folder))
  .map(resolveProject);

module.exports = {
  rootDir,
  nodePaths,
  // <PROJECT_ROOT>/node_modules
  nodeModules: resolveProject('node_modules'),
  // <PROJECT_ROOT>/.happypack
  happyPackDir: resolveProject('.happypack'),
  // <PROJECT_ROOT>/package.json
  pkgPath: resolveProject('package.json'),
  userbabelRc: resolveProject('.babelrc'),
  userEslintRc: resolveProject('.eslintrc'),
  userStylelintRc: resolveProject('.stylelintrc'),

  srcDir: resolveProject('src'),
  serverSrcDir: resolveProject('src/server'),
  clientSrcDir: resolveProject('src/client'),
  sharedDir: resolveProject('src/shared'),

  publicDir: resolveProject('public'),
  serverCompiledDir: resolveProject('build'),
  assetsDir: resolveProject('public/assets'),
  dllDir: resolveProject('public/assets/dlls'),
};
