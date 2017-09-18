const babelJest = require('babel-jest');

module.exports = babelJest.createTransformer({
  babelrc: false,
  presets: [['env', { targets: { node: 'current' }, modules: 'commonjs' }], 'react'],
  plugins: [
    'syntax-dynamic-import',
    ['fast-async', { spec: true }],
    'babel-plugin-universal-import',
    'transform-class-properties',
    'transform-object-rest-spread',
  ],
});
