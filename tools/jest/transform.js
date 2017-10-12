const babelJest = require('babel-jest');

module.exports = babelJest.createTransformer({
  babelrc: false,
  presets: [['env', { targets: { node: 'current' }, modules: 'commonjs' }], 'react'],
  plugins: [
    'syntax-dynamic-import',

    'babel-plugin-universal-import',
    'transform-class-properties',
    'transform-object-rest-spread',
  ],
});
