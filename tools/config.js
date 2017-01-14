const path = require('path');

const ABS_ROOT = path.resolve(process.cwd());

module.exports = {
  HMR_PORT: 3001,
  SSR_PORT: 3000,
  API_PORT: 8000,
  API_HOST: 'localhost',
  HOST: 'localhost',
  ROOT_DIR: ABS_ROOT,
  SRC_DIR: path.resolve(path.join(ABS_ROOT, 'src')),
  STATIC_DIR: path.resolve(path.join(ABS_ROOT, 'static')),
  ASSETS_DIR: path.resolve(path.join(ABS_ROOT, 'static', 'assets'))
};
