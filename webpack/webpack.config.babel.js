const path = require('path');
const webpack = require('webpack');
const WebpackIsomorphicToolsPlugin = require('webpack-isomorphic-tools/plugin');
const HappyPack = require('happypack');
const autoprefixer = require('autoprefixer');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const StyleLintPlugin = require('stylelint-webpack-plugin');
const findCacheDir = require('find-cache-dir');

const helpers = require('./util/helpers');
const createHappyPlugin = require('./util/createHappyPlugin');
const createSourceLoader = require('./util/createSourceLoader');
const dllHelpers = require('./util/dllHelpers');
const config = require('../config/defaults');
const isomorphicConfig = require('./util/isomorphic.config');

const debug = require('debug')('boldr:webpack');

const isDebug = process.env.NODE_ENV !== 'production';
const ENV = process.env.NODE_ENV || 'development';
const isDev = ENV !== 'production';
const isProd = ENV === 'production';
const ifDev = helpers.ifElse(isDev);
const ifProd = helpers.ifElse(isProd);

const webpackIsomorphicToolsPlugin =
  new WebpackIsomorphicToolsPlugin(isomorphicConfig).development(isDev)

module.exports = function webpackConfig(CSSModules) {

  return {
    target: 'web',
    stats: false,
    progress: true,
    devtool: isDev ? 'cheap-module-eval-source-map' : 'source-map',
    context: config.ROOT_DIR,
    cache: isDev,
    debug: isDev,
    entry: helpers.removeEmptyKeys({
      main: helpers.removeEmpty([
        ifDev('react-hot-loader/patch'),
        ifDev(`webpack-hot-middleware/client?reload=true&path=http://localhost:${config.HMR_PORT}/__webpack_hmr`),
        ifProd('babel-polyfill'),
        path.join(config.SRC_DIR, 'client.js')
      ]),
      vendor: ifProd([
        'react',
        'react-dom',
        'react-router',
        'redux',
        'react-redux',
        'react-router-redux',
        'react-helmet',
        'redux-thunk',
        'redial'
      ])
    }),
    output: {
      path: path.join(__dirname, '..', 'static'),
      filename: ifProd('[name]-[chunkhash].js', '[name].js'),
      chunkFilename: ifDev('[name]-[id].chunk.js', '[name]-[id].[chunkhash].js'),
      publicPath: ifDev(`http://localhost:${config.HMR_PORT}/assets/`, '/assets/')
    },
    resolve: {
      extensions: ['', '.js', '.jsx', '.json', '.css', '.scss'],
      modulesDirectories: ['src', 'node_modules']
    },
    module: {
      loaders: helpers.removeEmpty([
        createSourceLoader({
          happy: { id: 'js' },
          test: /\.jsx?$/,
          exclude: /node_modules/,
          loader: 'babel'
        }),
        { test: /\.json$/, loader: 'json' },
        { test: /\.woff2?(\?v=\d+\.\d+\.\d+)?$/, loader: 'url?limit=10000&mimetype=application/font-woff' },
        { test: /\.ttf(\?v=\d+\.\d+\.\d+)?$/, loader: 'url?limit=10000&mimetype=application/octet-stream' },
        { test: /\.eot(\?v=\d+\.\d+\.\d+)?$/, loader: 'file' },
        { test: /\.svg(\?v=\d+\.\d+\.\d+)?$/, loader: 'url?limit=10000&mimetype=image/svg+xml' },
        { test: webpackIsomorphicToolsPlugin.regular_expression('images'), loader: 'url-loader?limit=10240' },
        createSourceLoader({
          happy: { id: 'css' },
          test: /\.css$/,
          loader: isDev ?
            'style!css?localIdentName=[name]__[local].[hash:base64:5]&' +
            (CSSModules ? 'modules' : '') +
            '&sourceMap&-minimize&importLoaders=1!postcss' :
            ExtractTextPlugin.extract({
              fallbackLoader: 'style',
              loader: 'css?' +
              (CSSModules ? 'modules' : '') +
              '&sourceMap&importLoaders=1!postcss'
            }),
        }),
        createSourceLoader({
          happy: { id: 'sass' },
          test: /\.scss$/,
          loader: isDev ?
            'style!css?localIdentName=[name]__[local].[hash:base64:5]&' +
              (CSSModules ? 'modules' : '') +
              '&sourceMap&-minimize&importLoaders=2!postcss!sass?outputStyle=expanded&sourceMap' :
            ExtractTextPlugin.extract({
              fallbackLoader: 'style',
              loader: 'css?' +
              (CSSModules ? 'modules' : '') +
              '&sourceMap&importLoaders=2!postcss!sass?outputStyle=expanded&sourceMap&sourceMapContents'
            }),
        })
      ])
    },
    plugins: helpers.removeEmpty([
      new webpack.DefinePlugin({
        'process.env': {
          'NODE_ENV': JSON.stringify(process.env.NODE_ENV),
          'DEBUG': JSON.stringify(process.env.DEBUG)
        },
        __DEV__: process.env.NODE_ENV !== 'production',
        __DISABLE_SSR__: false,
        __CLIENT__: true,
        __SERVER__: false,
        __DLLS__: process.env.WEBPACK_DLLS === '1'
      }),
      webpackIsomorphicToolsPlugin,
      new webpack.LoaderOptionsPlugin({
        minimize: isProd,
        debug: !isProd
      }),
      ifDev(new webpack.HotModuleReplacementPlugin()),
      ifDev(new webpack.NoErrorsPlugin()),
      ifDev(new webpack.IgnorePlugin(/webpack-stats\.json$/)),
      ifDev(createHappyPlugin('js')),
      ifDev(createHappyPlugin('sass')),
      ifDev(createHappyPlugin('css')),
      ifProd(new webpack.optimize.CommonsChunkPlugin({
        name: ['main', 'vendor', 'manifest'],
        filename: '[name].[chunkhash].js',
        minChunks: Infinity
      })),
      ifProd(new ExtractTextPlugin({
        filename: '[name].[chunkhash].css',
        allChunks: true
      })),
      ifProd(new webpack.optimize.UglifyJsPlugin({
        compress: { screw_ie8: true, warnings: false },
        output: { comments: false },
        sourceMap: false,
      })),
      ifProd(new webpack.optimize.OccurrenceOrderPlugin(true)),
      ifProd(new webpack.optimize.AggressiveMergingPlugin())
    ]),
    postcss: [autoprefixer({ browsers: ['last 2 versions'] })],
    node: {
      __dirname: true,
      __filename: true
    }
  }
}
