const babelJest = require('babel-jest');

module.exports = babelJest.createTransformer({
  babelrc: false,
  presets: [['env', { targets: { node: true } }], 'react'],
  plugins: [
    'syntax-dynamic-import',
    'syntax-flow',
    'transform-class-properties',
    'transform-decorators-legacy',
    'dynamic-import-node',
    'dynamic-import-webpack',
    'transform-object-rest-spread',
    'transform-regenerator',
    'transform-runtime',
  ],
});
