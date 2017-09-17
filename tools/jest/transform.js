const babelJest = require('babel-jest');

module.exports = babelJest.createTransformer({
  babelrc: false,
  presets: [['env', { targets: { node: 'current' }, modules: 'commonjs' }], 'react'],
  plugins: [
    'syntax-dynamic-import',
    ['fast-async', { spec: true }],
    'transform-decorators-legacy',
    'transform-class-properties',
    'dynamic-import-node',
    'transform-object-rest-spread',
  ],
});
