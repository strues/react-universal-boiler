/* eslint-disable max-lines, prefer-template, complexity */

import path from 'path';
import fs from 'fs';
import webpack from 'webpack';
import dotenv from 'dotenv';
import ExtractCssChunks from 'extract-css-chunks-webpack-plugin';
import BabelMinifyPlugin from 'babel-minify-webpack-plugin';
import CaseSensitivePathsPlugin from 'case-sensitive-paths-webpack-plugin';
import CircularDependencyPlugin from 'circular-dependency-plugin';
import BundleAnalyzerPlugin from 'webpack-bundle-analyzer';
import SriPlugin from 'webpack-subresource-integrity';
import WriteFilePlugin from 'write-file-webpack-plugin';
import { getHashDigest } from 'loader-utils';
import AutoDllPlugin from 'autodll-webpack-plugin';
import { StatsPlugin, happyPackPlugin, ProgressPlugin, WebpackDigestHash } from './plugins';

import rootModuleRelativePath from '../utils/rootModuleRelativePath';

import {
  REQUIRED_ENV_VARS,
  CACHE_HASH_TYPE,
  CACHE_DIGEST_TYPE,
  CACHE_DIGEST_LENGTH,
  JS_FILES,
  STYLE_FILES,
  ASSET_FILES,
} from './constants';

const LOCAL_IDENT = '[local]-[hash:base62:8]';

dotenv.config();

const envParameters = Object.keys(process.env);
// Fail early if our env vars arent set.
const missingParameters = REQUIRED_ENV_VARS.filter(key => !envParameters.includes(key));
if (missingParameters.length > 0) {
  throw new Error(
    `Missing environment parameters ${missingParameters.join(', ')}.\n` +
      `Hint: Please provide a proper .env file`,
  );
}

const relativeResolve = rootModuleRelativePath(require);
const ROOT = fs.realpathSync(process.cwd());
const SRC_DIR = path.resolve(ROOT, 'src');

const SERVER_ENTRY_NAME = process.env.SERVER_ENTRY || 'src/server/server.js';
const SERVER_ENTRY = path.resolve(ROOT, SERVER_ENTRY_NAME);

const CLIENT_ENTRY_NAME = process.env.CLIENT_ENTRY || 'src/client/client.js';
const CLIENT_ENTRY = path.resolve(ROOT, CLIENT_ENTRY_NAME);

const VENDOR_NAME = process.env.VENDOR_FILE || 'src/vendor.js';
const CLIENT_VENDOR = path.resolve(ROOT, VENDOR_NAME);

const SERVER_OUT = process.env.SERVER_OUTPUT || 'build';
const SERVER_OUTPUT = path.resolve(ROOT, SERVER_OUT);

const CLIENT_OUT = process.env.CLIENT_OUTPUT || 'build/assets';
const CLIENT_OUTPUT = path.resolve(ROOT, CLIENT_OUT);

const defaults = {
  target: 'client',
  env: process.env.NODE_ENV,
  verbose: false,
  useSourceMaps: true,
};

export default function createWebpackConfig(options) {
  const config = { ...defaults, ...options };
  // process.env.NODE_ENV should be defined, but if it's not we'll set it here
  if (config.env === null) {
    config.env = 'development';
  }

  const _IS_SERVER_ = config.target === 'server';
  const _IS_CLIENT_ = config.target === 'client';
  const _IS_DEV_ = config.env === 'development';
  const _IS_PROD_ = config.env === 'production';
  const webpackTarget = _IS_SERVER_ ? 'node' : 'web';

  const PREFIX = config.target.toUpperCase();
  const PKG_JSON = require(path.resolve(ROOT, './package.json'));

  const CACHE_HASH = getHashDigest(
    JSON.stringify(PKG_JSON),
    CACHE_HASH_TYPE,
    CACHE_DIGEST_TYPE,
    CACHE_DIGEST_LENGTH,
  );
  const NODE_EXTERNALS = fs
    .readdirSync(path.resolve(ROOT, 'node_modules'))
    .filter(
      x => !/\.bin|react-universal-component|require-universal-module|webpack-flush-chunks/.test(x),
    )
    .reduce((NODE_EXTERNALS, mod) => {
      NODE_EXTERNALS[mod] = `commonjs ${mod}`;
      return NODE_EXTERNALS;
    }, {});

  // different cache dir for different environments and targets
  const CACHE_LOADER_DIRECTORY = path.resolve(
    ROOT,
    // $FlowIssue
    `node_modules/.cache/loader-${CACHE_HASH}-${config.target}-${config.env}`,
  );

  const browserTargets = {
    browsers: ['> .5% in US', 'last 1 versions'],
  };

  const serverTargets = {
    node: 'current',
  };

  const name = _IS_CLIENT_ ? 'client' : 'server';
  const target = _IS_CLIENT_ ? 'web' : 'node';
  const devtool = _IS_DEV_ ? 'cheap-module-source-map' : 'source-map';

  const cacheLoader = {
    loader: 'cache-loader',
    options: {
      cacheDirectory: CACHE_LOADER_DIRECTORY,
    },
  };
  const cssLoaderOptions = {
    modules: true,
    localIdentName: LOCAL_IDENT,
    import: 3,
    minimize: false,
    sourceMap: true,
  };

  const postCSSLoaderRule = {
    loader: 'postcss-loader',
    options: {
      // https://webpack.js.org/guides/migrating/#complex-options
      ident: 'postcss',
      sourceMap: true,
      plugins: () => [
        require('postcss-flexbugs-fixes'),
        require('postcss-cssnext')({
          browsers: ['> 1%', 'last 2 versions'],
          flexbox: 'no-2009',
        }),
        require('postcss-discard-duplicates'),
      ],
    },
  };
  const sassLoaderRule = {
    loader: 'sass-loader',
    options: {
      sourceMap: true,
      minimize: false,
    },
  };

  const HMR_MIDDLEWARE = `webpack-hot-middleware/client?path=/__webpack_hmr&timeout=20000&reload=true&quiet=false&noInfo=true&overlay=false`;

  const getClientEntry = () => {
    // For development
    let entry = ['react-hot-loader/patch', HMR_MIDDLEWARE, CLIENT_ENTRY];
    if (!_IS_DEV_) {
      entry = {
        vendor: CLIENT_VENDOR,
        main: CLIENT_ENTRY,
      };
    }

    return entry;
  };
  const getServerEntry = () => {
    const entry = { server: SERVER_ENTRY };
    return entry;
  };

  return {
    name,
    // pass either node or web
    target,
    // user's project root
    context: ROOT,
    // sourcemap
    devtool,
    entry: _IS_SERVER_ ? getServerEntry() : getClientEntry(),
    output: {
      // build/assets/*
      path: _IS_SERVER_ ? SERVER_OUTPUT : CLIENT_OUTPUT,
      libraryTarget: _IS_SERVER_ ? 'commonjs2' : 'var',
      filename: _IS_DEV_ || _IS_SERVER_ ? '[name].js' : '[name]-[chunkhash].js',
      chunkFilename: _IS_DEV_ || _IS_SERVER_ ? '[name].js' : '[name]-[chunkhash].js',
      // Full URL in dev otherwise we expect our bundled output to be served from /assets/
      publicPath: '/assets/',
      // only dev
      pathinfo: _IS_DEV_,
      // Enable cross-origin loading without credentials - Useful for loading files from CDN
      crossOriginLoading: 'anonymous',
      devtoolModuleFilenameTemplate: _IS_DEV_
        ? info => path.resolve(info.absoluteResourcePath)
        : info => path.resolve(ROOT, info.absoluteResourcePath),
    },
    // fail on err
    bail: !_IS_DEV_,
    // cache dev
    // Cache the generated webpack modules and chunks to improve build speed.
    cache: _IS_DEV_,
    // true if prod & enabled in settings
    profile: false,
    externals: _IS_SERVER_ ? NODE_EXTERNALS : undefined,
    // Include polyfills and/or mocks for node features unavailable in browser
    // environments. These are typically necessary because package's will
    // occasionally include node only code.
    node: _IS_CLIENT_
      ? {
          console: true,
          __filename: true,
          __dirname: true,
        }
      : {
          Buffer: false,
          __dirname: false,
          __filename: false,
          console: false,
          global: true,
          process: false,
        },
    performance: _IS_DEV_
      ? false
      : {
          hints: 'warning',
        },

    resolve: {
      // look for files in the descendants of src/ then node_modules
      modules: ['node_modules', SRC_DIR, path.resolve(ROOT, 'node_modules')],
      // Webpack will look for the following fields when searching for libraries
      mainFields: _IS_CLIENT_
        ? ['browser:modern', 'browser:esnext', 'web:modern', 'browser', 'module', 'main']
        : ['esnext:main', 'module:modern', 'main:modern', 'jsnext:main', 'module', 'main'],
      descriptionFiles: ['package.json'],
      // We want files with the following extensions...
      extensions: ['.js', '.jsx', '.mjs', '.json', '.css', '.scss'],
      alias: {
        'babel-runtime': relativeResolve('babel-runtime/package.json'),
      },
    },
    module: {
      strictExportPresence: true,

      rules: [
        {
          test: JS_FILES,
          loader: 'source-map-loader',
          enforce: 'pre',
          options: {
            quiet: true,
          },
          // these can be problematic loading sourcemaps that may/may not exist
          exclude: [/apollo-/, /zen-observable-ts/, /react-apollo/, /intl-/],
        },
        // url loader for webfonts
        {
          test: /\.(ttf|woff|woff2)$/,
          loader: 'url-loader',
          exclude: /node_modules/,
          options: { limit: 10000, emitFile: _IS_CLIENT_ },
        },
        // url loader for images
        {
          test: /\.(jpe?g|png|gif)$/,
          exclude: /node_modules/,
          loader: 'file-loader',
        },
        // url loader to inline small svgs
        {
          test: /\.svg(\?v=\d+\.\d+\.\d+)?$/,
          exclude: /node_modules/,
          loader: 'url-loader?limit=10000&mimetype=image/svg+xml',
        },
        // file
        // References to images, fonts, movies, music, etc.
        {
          test: ASSET_FILES,
          loader: 'file-loader',
          exclude: [
            /\.html$/,
            /\.(js|jsx)$/,
            /\.(ts|tsx)$/,
            /\.(re)$/,
            /\.(s?css|sass)$/,
            /\.json$/,
            /\.bmp$/,
            /\.gif$/,
            /\.jpe?g$/,
            /\.png$/,
          ],
          options: {
            name: _IS_PROD_ ? 'file-[hash:base62:8].[ext]' : '[name].[ext]',
            // dont emit a file for the server
            emitFile: _IS_CLIENT_,
          },
        },
        // JS
        {
          test: JS_FILES,
          include: SRC_DIR,
          use: [
            cacheLoader,
            {
              loader: 'happypack/loader?id=hp-js',
            },
          ].filter(Boolean),
        },
        // Sass
        {
          test: STYLE_FILES,
          include: SRC_DIR,
          use: _IS_CLIENT_
            ? ExtractCssChunks.extract({
                use: [
                  cacheLoader,
                  {
                    loader: 'css-loader',
                    options: cssLoaderOptions,
                  },
                  {
                    loader: 'resolve-url-loader',
                  },
                  postCSSLoaderRule,
                  sassLoaderRule,
                ].filter(Boolean),
              })
            : [
                cacheLoader,
                {
                  loader: 'css-loader/locals',
                  options: cssLoaderOptions,
                },
                {
                  loader: 'resolve-url-loader',
                },
                postCSSLoaderRule,
                sassLoaderRule,
              ].filter(Boolean),
        },
      ].filter(Boolean),
    },
    plugins: [
      new webpack.LoaderOptionsPlugin({
        minimize: _IS_PROD_,
        debug: _IS_DEV_,
        context: ROOT,
      }),
      // Whatever is passed here will be inlined during the bundling process.
      new webpack.DefinePlugin({
        __DEV__: JSON.stringify(_IS_DEV_),
        __SERVER__: JSON.stringify(_IS_SERVER_),
        'process.env.NODE_ENV': JSON.stringify(options.env),
        'process.env.TARGET': JSON.stringify(webpackTarget),
      }),
      _IS_DEV_
        ? new WriteFilePlugin({
            exitOnErrors: false,
            log: true,
            // required not to cache removed files
            useHashIndex: false,
          })
        : null,
      _IS_CLIENT_
        ? new ExtractCssChunks({
            filename: _IS_DEV_ ? '[name].css' : '[name]-[contenthash:base62:8].css',
          })
        : null,
      // Extract Webpack bootstrap code with knowledge about chunks into separate cachable package.
      // explicit-webpack-runtime-chunk
      _IS_CLIENT_
        ? new webpack.optimize.CommonsChunkPlugin({
            names: _IS_DEV_ ? ['bootstrap'] : ['vendor', 'bootstrap'],
            //   // needed to put webpack bootstrap code before chunks
            filename: _IS_DEV_ ? '[name].js' : '[name]-[chunkhash].js',
            minChunks: Infinity,
          })
        : null,
      // Custom progress plugin
      new ProgressPlugin({ prefix: PREFIX }),
      // Subresource Integrity (SRI) is a security feature that enables browsers to verify that
      // files they fetch (for example, from a CDN) are delivered without unexpected manipulation.
      // https://www.npmjs.com/package/webpack-subresource-integrity
      // Browser-Support: http://caniuse.com/#feat=subresource-integrity
      new SriPlugin({
        hashFuncNames: ['sha256', 'sha512'],
        enabled: _IS_PROD_ && _IS_CLIENT_,
      }),

      /**
       * HappyPack Plugins are used as caching mechanisms to reduce the amount
       * of time Webpack spends rebuilding, during your bundling during
       * development.
       * @see https://github.com/amireh/happypack for more info
       * @type {String}   The HappyPack loader id
       */
      happyPackPlugin({
        name: 'hp-js',
        loaders: [
          {
            path: 'babel-loader',
            query: {
              babelrc: false,
              sourceMaps: true,
              comments: false,
              cacheDirectory: _IS_DEV_,
              compact: _IS_PROD_,
              presets: [
                [
                  'env',
                  {
                    useBuiltins: true,
                    modules: false,
                    exclude: ['transform-regenerator', 'transform-async-to-generator'],
                    targets: _IS_CLIENT_ ? browserTargets : serverTargets,
                  },
                ],
                'react',
              ],
              plugins: [
                'syntax-dynamic-import',
                [
                  'fast-async',
                  {
                    spec: true,
                  },
                ],
                // static defaultProps = {} or state = {}
                [
                  'transform-class-properties',
                  {
                    spec: true,
                  },
                ],
                // ...foo
                [
                  'transform-object-rest-spread',
                  {
                    useBuiltIns: true,
                  },
                ],
                'babel-plugin-universal-import',
                // Adds component stack to warning messages
                _IS_DEV_ ? 'transform-react-jsx-source' : null,
                // Adds __self attribute to JSX which React
                // will use for some warnings
                _IS_DEV_ ? 'transform-react-jsx-self' : null,
                _IS_DEV_ ? 'react-hot-loader/babel' : null,
                // @NOTE:
                // Dont want to use styled-components?
                // remove this babel plugin
                [
                  'styled-components',
                  {
                    ssr: true,
                    preprocess: true,
                  },
                ],
              ].filter(Boolean),
            },
          },
        ],
      }),

      // Improve OS compatibility
      // https://github.com/Urthen/case-sensitive-paths-webpack-plugin
      new CaseSensitivePathsPlugin(),
      // Detect modules with circular dependencies when bundling with webpack.
      // @see https://github.com/aackerman/circular-dependency-plugin
      _IS_DEV_
        ? new CircularDependencyPlugin({
            exclude: /a\.js|node_modules/,
            // show a warning when there is a circular dependency
            failOnError: false,
          })
        : null,
      _IS_PROD_ && _IS_CLIENT_ ? new WebpackDigestHash() : null,
      // Let the server side renderer know about our client side assets
      // https://github.com/FormidableLabs/webpack-stats-plugin
      _IS_PROD_ && _IS_CLIENT_ ? new StatsPlugin('stats.json') : null,
      // Use HashedModuleIdsPlugin to generate IDs that preserves over builds
      // @see https://github.com/webpack/webpack.js.org/issues/652#issuecomment-273324529
      // @NOTE: if using flushChunkNames rather than flushModuleIds you must disable this...
      _IS_PROD_ ? new webpack.HashedModuleIdsPlugin() : null,
      // I would recommend using NamedModulesPlugin during development (better output).
      // Via: https://github.com/webpack/webpack.js.org/issues/652#issuecomment-273023082
      _IS_DEV_ ? new webpack.NamedModulesPlugin() : null,
      // Analyse bundle in production
      _IS_CLIENT_ && _IS_PROD_
        ? new BundleAnalyzerPlugin.BundleAnalyzerPlugin({
            analyzerMode: 'static',
            defaultSizes: 'gzip',
            logLevel: 'silent',
            openAnalyzer: false,
            reportFilename: 'report.html',
          })
        : null,

      // Analyse bundle in production
      _IS_SERVER_ && _IS_PROD_
        ? new BundleAnalyzerPlugin.BundleAnalyzerPlugin({
            analyzerMode: 'static',
            defaultSizes: 'parsed',
            logLevel: 'silent',
            openAnalyzer: false,
            reportFilename: 'report.html',
          })
        : null,
      _IS_SERVER_ ? new webpack.optimize.LimitChunkCountPlugin({ maxChunks: 1 }) : null,
      _IS_PROD_ && _IS_CLIENT_ ? new BabelMinifyPlugin({}, { comments: false }) : null,

      _IS_PROD_ ? new webpack.optimize.ModuleConcatenationPlugin() : null,
      // Dll reference speeds up development by grouping all of your vendor dependencies
      // in a DLL file. This is not compiled again, unless package.json contents
      // have changed.
      _IS_DEV_ && _IS_CLIENT_
        ? new AutoDllPlugin({
            context: ROOT,
            filename: '[name].js',
            entry: {
              vendor: [
                'react',
                'react-dom',
                'react-router-dom',
                'redux',
                'react-redux',
                'redux-thunk',
                'redux-logger',
                'react-router-redux',
                'axios',
                'styled-components',
                'react-helmet',
                'serialize-javascript',
                'history',
                'react-universal-component',
              ],
            },
          })
        : null,
      _IS_DEV_ ? new webpack.NoEmitOnErrorsPlugin() : null,
      _IS_CLIENT_ && _IS_DEV_ ? new webpack.HotModuleReplacementPlugin() : null,
    ].filter(Boolean),
  };
}
