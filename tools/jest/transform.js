const babelJest = require('babel-jest');

module.exports = babelJest.createTransformer({
  babelrc: false,
  presets: [['env', { targets: { node: 'current' }, modules: 'commonjs' }], 'react'],
  plugins: [
    'syntax-dynamic-import',
    ['fast-async', { spec: true }],
    'transform-class-properties',
    'transform-decorators-legacy',
    'dynamic-import-node',
    'transform-object-rest-spread',
  ],
});
