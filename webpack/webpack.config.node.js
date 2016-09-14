const path = require('path');
const fs = require('fs');
const webpack = require('webpack');
const NodeExternals = require('webpack-node-externals');

const config = require('../config/defaults');

const nodeConfig = { // eslint-disable-line
  target: 'node',
  stats: false,
  progress: true,
  bail: true,
  externals: NodeExternals(),
  context: __dirname,
  devtool: 'source-map',
  entry: {
    server: [
      path.resolve(path.join(config.SRC_DIR, 'server.js'))
    ]
  },
  output: {
    path: path.resolve(__dirname, '../static'),
    pathInfo: true,
    chunkFilename: '[name]-[chunkhash].js',
    filename: '[name].js',
    libraryTarget: 'commonjs2'
  },
  resolve: {
    extensions: ['', '.js', '.jsx', '.json'],
    modulesDirectories: ['src', 'node_modules'],
    mainFields: ['jsnext:main', 'main']
  },
  module: {
    loaders: [
      {
        test: /\.jsx?$/,
        loader: 'babel-loader',
        exclude: /(node_modules)/
      },
      { test: /\.json$/, loader: 'json-loader' },
      {
        test: /\.css$/,
        loaders: [
          'css-loader/locals',
          'postcss'
        ]
      },
      { test: /\.scss$/,
        loaders: [
          'css-loader/locals',
          'postcss',
          'sass'
        ]
      }
    ]
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify('production'),
        SSR_PORT: parseInt(process.env.SSR_PORT, 10)
      },
      __DEV__: process.env.NODE_ENV !== 'production',
      __DISABLE_SSR__: false,
      __CLIENT__: false,
      __SERVER__: true
    }),
    new webpack.IgnorePlugin(/\.(css|less|scss|svg|png|jpe?g|png)$/, 'node-noop'),
    new webpack.optimize.LimitChunkCountPlugin({
      maxChunks: 1
    })
  ],
  node: {
    __filename: true,
    __dirname: true
  }
};

module.exports = nodeConfig;
