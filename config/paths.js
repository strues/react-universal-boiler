const path = require('path');

const ABS_ROOT = process.cwd();

  const paths = {
    root: path.resolve(process.cwd()),
    src: path.join(ABS_ROOT, 'src'),
    build: path.join(ABS_ROOT, 'static')
  }

  module.exports = paths;