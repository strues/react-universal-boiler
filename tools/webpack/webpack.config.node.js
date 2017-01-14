const path = require('path');
const fs = require('fs');
const webpack = require('webpack');
const _ = require('lodash');
const NodeExternals = require('webpack-node-externals');
const WebpackIsomorphicToolsPlugin = require('webpack-isomorphic-tools/plugin');
const config = require('../config');
const isomorphicConfig = require('./util/isomorphic.config');

const webpackIsomorphicToolsPlugin =
        new WebpackIsomorphicToolsPlugin(isomorphicConfig);

const ignoredAssetGroups = [
  'stylesCss',
  'stylesSass',
  'fonts'
];

const plugins = [
  new webpack.DefinePlugin({
    'process.env': {
      NODE_ENV: JSON.stringify('production'),
      SSR_PORT: JSON.stringify(process.env.SSR_PORT)
    },
    __DEV__: process.env.NODE_ENV !== 'production',
    __DISABLE_SSR__: false,
    __CLIENT__: false,
    __SERVER__: true
  }),

  new webpack.optimize.LimitChunkCountPlugin({
    maxChunks: 1
  })
];

/**
 * Add node noop
 * @param {[type]} regExpGroup [description]
 */
function addNodeNoop(regExpGroup) {
  new webpack.NormalModuleReplacementPlugin(
    webpackIsomorphicToolsPlugin.regular_expression(regExpGroup),
    'node-noop'
  );
}
_.forEach(ignoredAssetGroups, addNodeNoop);

const nodeConfig = { // eslint-disable-line
  target: 'node',
  stats: true,
  bail: true,
  externals: NodeExternals(),
  devtool: '#source-map',
  entry: {
    server: [
      'source-map-support/register',
      path.resolve(path.join(config.SRC_DIR, 'server.js'))
    ]
  },
  output: {
    path: path.resolve(config.STATIC_DIR),
    chunkFilename: '[name]-[chunkhash].js',
    filename: '[name].js',
    libraryTarget: 'commonjs2'
  },
  resolve: {
    extensions: ['.js', '.jsx', '.json'],
    modules: ['src', 'node_modules'],
  },
  module: {
    loaders: [
      {
        test: /\.jsx?$/,
        exclude: /(node_modules)/,
        loader: 'babel-loader',
        query: {
          babelrc: false,
          compact: true,
          presets: ['react', 'stage-2', ['env', { targets: { node: true }, modules: false }]],
          plugins: ['transform-decorators-legacy']
        }
      },
      { test: /\.json$/, loader: 'json-loader' },
      {
        test: /\.css$/,
        loaders: [
          'css-loader/locals',
          'postcss-loader'
        ]
      },
      { test: /\.scss$/,
        loaders: [
          'css-loader/locals',
          'postcss-loader',
          'sass-loader'
        ]
      }
    ],
    noParse: /\.min\.js/
  },
  plugins,
  node: {
    __filename: true,
    __dirname: true,
    global: true
  }
};

module.exports = nodeConfig;
