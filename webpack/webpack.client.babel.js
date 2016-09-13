const path = require('path');
const webpack = require('webpack');
const helpers = require('./util/helpers');
const cfg = require('../config/defaults');
const paths = require('../config/paths');

const debug = require('debug')('webpack');

const isDebug = process.env.NODE_ENV !== 'production';
const isDev = process.env.NODE_ENV === 'development';
const isProd = process.env.NODE_ENV === 'production';

const config = {
  target: 'web',
  stats: false,
  progress: true,
  devtool: isDebug ? 'cheap-module-eval-source-map' : false,
  context: path.resolve(paths.src),
  debug: isDebug,
  entry: {
    main: [
      'react-hot-loader/patch',
      `webpack-hot-middleware/client?reload=true&path=http://localhost:${cfg.HMR_PORT}/__webpack_hmr`,
      'babel-polyfill',
      path.join(paths.src, 'client.js')
    ]
  },
  output: {
    path: paths.build,
    filename: '[name].js',
    chunkFilename: '[name]-chunk.js',
    publicPath: `http://localhost:${cfg.HMR_PORT}/build/`
  },
  resolve: {
    extensions: ['', '.js', '.jsx', '.json', '.css', '.scss'],
    modulesDirectories: ['src', 'node_modules'],
    alias: {
    }
  },
  module: {
    loaders: [
      {
        test: /\.(js|jsx)$/,
        include: paths.src,
        exclude: /node_modules/,
        loader: 'babel',
        query: require('../config/babel-dev.config')
      },
      {
        test: /\.json$/,
        loader: 'json'
      },
    ]
  },
  plugins: helpers.removeEmpty([
    new webpack.NoErrorsPlugin(),
    new webpack.DefinePlugin({
      'process.env': {
        'NODE_ENV': JSON.stringify(process.env.NODE_ENV),
        'DEBUG': JSON.stringify(process.env.DEBUG),
      },
    }),
  ])

}
module.exports = config;