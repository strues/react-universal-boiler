const path = require('path');

const ABS_ROOT = path.resolve(process.cwd());

const HMR_PORT = 3001;
const SSR_PORT = 3000;
const HOST = 'localhost';

module.exports = {
  HMR_PORT: 3001,
  SSR_PORT: 3000,
  HOST: 'localhost',
  ROOT_DIR: ABS_ROOT,
  SRC_DIR: path.join(ABS_ROOT, 'src'),
  STATIC_DIR: path.join(ABS_ROOT, 'static'),
  ASSETS_DIR: path.join(ABS_ROOT, 'static', 'assets')
};
