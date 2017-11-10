/* eslint-disable max-lines, prefer-template, complexity */

import path from 'path';
import fs from 'fs-extra';
import webpack from 'webpack';
import dotenv from 'dotenv';
import ExtractCssChunks from 'extract-css-chunks-webpack-plugin';
import BabelMinifyPlugin from 'babel-minify-webpack-plugin';
import CaseSensitivePathsPlugin from 'case-sensitive-paths-webpack-plugin';
import CircularDependencyPlugin from 'circular-dependency-plugin';
import BundleAnalyzerPlugin from 'webpack-bundle-analyzer';
import OfflinePlugin from 'offline-plugin';

import WriteFilePlugin from 'write-file-webpack-plugin';
import { getHashDigest } from 'loader-utils';
import AutoDllPlugin from 'autodll-webpack-plugin';
import { StatsPlugin, happyPackPlugin, WebpackDigestHash } from './plugins';
import {
  REQUIRED_ENV_VARS,
  CACHE_HASH_TYPE,
  CACHE_DIGEST_TYPE,
  CACHE_DIGEST_LENGTH,
  CSSNANO_OPT,
  JS_FILES,
  STYLE_FILES,
  ASSET_FILES,
} from './constants';

const LOCAL_IDENT = '[local]-[hash:base62:8]';

// Root directory and src directory path
const ROOT = fs.realpathSync(process.cwd());
const SRC_DIR = path.resolve(ROOT, 'src');

// Assign a constant to paths resolved from env variables.
const SERVER_ENTRY_NAME = process.env.SERVER_ENTRY || 'src/entry/server.js';
const SERVER_ENTRY = path.resolve(ROOT, SERVER_ENTRY_NAME);
// client
const CLIENT_ENTRY_NAME = process.env.CLIENT_ENTRY || 'src/entry/client.js';
const CLIENT_ENTRY = path.resolve(ROOT, CLIENT_ENTRY_NAME);

// Server/Client outputs
const SERVER_OUT = process.env.SERVER_OUTPUT || 'build';
const SERVER_OUTPUT = path.resolve(ROOT, SERVER_OUT);
// client
const CLIENT_OUT = process.env.CLIENT_OUTPUT || 'build/assets';
const CLIENT_OUTPUT = path.resolve(ROOT, CLIENT_OUT);

dotenv.config();
const envVars = Object.keys(process.env);
// Fail early if our env vars arent set.
const missingEnv = REQUIRED_ENV_VARS.filter(key => !envVars.includes(key));
if (missingEnv.length > 0) {
  throw new Error(
    `Missing environment variables ${missingEnv.join(', ')}.\n` +
      `Hint: Check your .env file and ensure all variables have values.`,
  );
}

const defaults = {
  target: 'client',
  env: process.env.NODE_ENV,
  verbose: false,
  useSourceMaps: true,
  analyzeServerBundle: false,
  analyzeClientBundle: true,
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

  const serverTargets = {
    node: '8',
  };
  const browserTargets = {
    browsers: {
      android: '4.4.3',
      chrome: '> 54',
      edge: '> 16',
      firefox: '55',
      ios: '10',
      safari: '10.1',
    },
  };

  const name = _IS_CLIENT_ ? 'client' : 'server';
  const target = _IS_CLIENT_ ? 'web' : 'node';
  const devtool = _IS_DEV_ ? 'cheap-module-inline-source-map' : 'source-map';

  const cacheLoader = {
    loader: 'cache-loader',
    options: {
      cacheDirectory: CACHE_LOADER_DIRECTORY,
    },
  };

  const cssLoaderOptions = {
    modules: true,
    localIdentName: _IS_DEV_ ? LOCAL_IDENT : '[hash:base64:5]',
    import: 2,
    minimize: _IS_DEV_ ? false : CSSNANO_OPT,
    sourceMap: _IS_DEV_,
  };

  const postCSSLoaderRule = {
    loader: 'postcss-loader',
    options: {
      // https://webpack.js.org/guides/migrating/#complex-options
      ident: 'postcss',
      sourceMap: _IS_DEV_,
      plugins: () => [
        require('postcss-flexbugs-fixes'),
        require('postcss-cssnext')({
          browsers: PKG_JSON.browserslist,
          flexbox: 'no-2009',
        }),
      ],
    },
  };

  const sassLoaderRule = {
    loader: 'sass-loader',
    options: {
      sourceMap: _IS_DEV_,
      minimize: _IS_DEV_ ? false : CSSNANO_OPT,
    },
  };

  const HMR_MIDDLEWARE = `webpack-hot-middleware/client?path=/__webpack_hmr&timeout=20000&reload=true&quiet=false&noInfo=true&overlay=false`;

  const getClientEntry = () => {
    // For development
    let entry = [
      'react-hot-loader/patch',
      HMR_MIDDLEWARE,
      require.resolve('./polyfills'),
      CLIENT_ENTRY,
    ];
    if (!_IS_DEV_) {
      entry = {
        // vendor: VENDOR_FILES,
        main: [require.resolve('./polyfills'), CLIENT_ENTRY],
      };
    }

    return entry;
  };

  const getServerEntry = () => {
    const entry = { server: [require.resolve('./nodePolyfills'), SERVER_ENTRY] };
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
    // fail on err
    bail: !_IS_DEV_,
    // cache dev
    // Cache the generated webpack modules and chunks to improve build speed.
    cache: _IS_DEV_,
    // true if prod & enabled in settings
    profile: false,

    entry: _IS_SERVER_ ? getServerEntry() : getClientEntry(),
    output: {
      // build/assets/*
      path: _IS_SERVER_ ? SERVER_OUTPUT : CLIENT_OUTPUT,
      libraryTarget: _IS_SERVER_ ? 'commonjs2' : 'var',
      filename: _IS_DEV_ || _IS_SERVER_ ? '[name].js' : '[name]-[chunkhash].js',
      chunkFilename: _IS_DEV_ || _IS_SERVER_ ? '[name].js' : '[name]-[chunkhash].js',
      // Full URL in dev otherwise we expect our bundled output to be served from /assets/
      publicPath: process.env.PUBLIC_PATH,
      // only dev
      pathinfo: _IS_DEV_,
      // Enable cross-origin loading without credentials - Useful for loading files from CDN
      crossOriginLoading: 'anonymous',
      devtoolModuleFilenameTemplate: info =>
        path.resolve(info.absoluteResourcePath).replace(/\\/g, '/'),
    },
    // server externals
    externals: _IS_SERVER_ ? NODE_EXTERNALS : undefined,
    // Include polyfills and/or mocks for node features unavailable in browser
    // environments. These are typically necessary because package's will
    // occasionally include node only code.
    node: _IS_CLIENT_
      ? {
          dgram: 'empty',
          fs: 'empty',
          net: 'empty',
          tls: 'empty',
          // eslint-disable-next-line
          child_process: 'empty',
        }
      : {
          console: false,
          global: false,
          process: false,
          Buffer: false,
          __filename: false,
          __dirname: false,
        },
    performance: _IS_DEV_
      ? false
      : {
          hints: 'warning',
          assetFilter: assetFilename => {
            return assetFilename.endsWith('.js');
          },
        },

    resolve: {
      // look for files in the descendants of src/ then node_modules
      modules: ['node_modules', SRC_DIR],
      // Webpack will look for the following fields when searching for libraries
      mainFields: _IS_CLIENT_
        ? ['browser:modern', 'browser:esnext', 'web:modern', 'browser', 'module', 'main']
        : ['esnext:main', 'module:modern', 'main:modern', 'jsnext:main', 'module', 'main'],
      descriptionFiles: ['package.json'],
      // We want files with the following extensions...
      extensions: ['.js', '.jsx', '.mjs', '.json', '.css', '.scss'],
    },
    module: {
      // Throws an error rather than warning you on missing exports
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
                postCSSLoaderRule,
                sassLoaderRule,
              ].filter(Boolean),
        },
      ].filter(Boolean),
    },
    plugins: [
      new webpack.LoaderOptionsPlugin({
        minimize: _IS_PROD_,
        debug: !_IS_PROD_,
        context: ROOT,
      }),
      // Whatever is passed here will be inlined during the bundling process.
      new webpack.DefinePlugin({
        __DEV__: _IS_DEV_,
        __SERVER__: _IS_SERVER_,
        __CLIENT__: _IS_CLIENT_,
        __PUB_PATH__: JSON.stringify(process.env.PUBLIC_PATH),
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
      _IS_CLIENT_ && _IS_PROD_
        ? new webpack.optimize.CommonsChunkPlugin({
            name: 'vendor',
            minChunks: module => /node_modules/.test(module.resource),
          })
        : null,
      // Extract Webpack bootstrap code with knowledge about chunks into separate cachable package.
      // explicit-webpack-runtime-chunk
      _IS_CLIENT_
        ? new webpack.optimize.CommonsChunkPlugin({
            names: 'bootstrap',
            //   // needed to put webpack bootstrap code before chunks
            filename: _IS_DEV_ ? '[name].js' : '[name]-[chunkhash].js',
            minChunks: Infinity,
          })
        : null,

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
              // @NOTE: comments are necessary for proper code splitting.
              // without we're unable to match our css chunks w/ the correct
              // universal component. instead all css will come through main.css :()
              comments: true,
              cacheDirectory: _IS_DEV_,
              compact: _IS_PROD_,
              presets: [
                [
                  // A Babel preset that compiles ES2015+ down to ES5 by automatically determining the Babel plugins and polyfills
                  // you need based on your targeted browser or runtime environments.
                  // @see: https://github.com/babel/babel/tree/master/experimental/babel-preset-env
                  'env',
                  {
                    debug: true,
                    modules: false,
                    useBuiltIns: false,
                    loose: true,
                    exclude: ['transform-regenerator', 'transform-async-to-generator'],
                    targets: _IS_CLIENT_ ? browserTargets : serverTargets,
                  },
                ],
                // @see: https://github.com/babel/babel/tree/master/packages/babel-preset-react

                'react',
              ],
              plugins: [
                // Allow parsing of import().
                // @see: https://github.com/babel/babel/tree/master/packages/babel-plugin-syntax-dynamic-import
                'syntax-dynamic-import',
                // Remove flowtypes from code
                // @see: https://github.com/babel/babel/tree/master/packages/babel-plugin-transform-flow-strip-types
                'transform-flow-strip-types',
                // static defaultProps = {} or state = {}
                // @see: https://github.com/babel/babel/tree/master/packages/babel-plugin-transform-class-properties
                [
                  'transform-class-properties',
                  {
                    loose: true,
                  },
                ],
                // [...a, 'foo'];
                // @see https://github.com/babel/babel/tree/master/packages/babel-plugin-transform-es2015-spread
                'transform-es2015-spread',
                // ...foo
                // @see: https://github.com/babel/babel/tree/master/packages/babel-plugin-transform-object-rest-spread
                [
                  'transform-object-rest-spread',
                  {
                    useBuiltIns: true,
                  },
                ],
                // universal(props => import(`./${props.page}`)) + dual css/js imports
                // @see: https://github.com/faceyspacey/babel-plugin-universal-import
                'universal-import',

                // @see: https://www.styled-components.com/docs/tooling#babel-plugin
                [
                  'styled-components',
                  {
                    ssr: true,
                    displayName: _IS_DEV_,
                    preprocess: true,
                  },
                ],
                // Remove PropTypes from prod build.
                // @see: https://github.com/oliviertassinari/babel-plugin-transform-react-remove-prop-types
                _IS_DEV_
                  ? 'react-hot-loader/babel'
                  : [
                      'transform-react-remove-prop-types',
                      {
                        mode: 'remove',
                        removeImport: true,
                      },
                    ],
                // Replace React.createElement w/ a more suitable function for prod
                // @see: https://github.com/babel/babel/tree/master/packages/babel-plugin-transform-react-inline-elements
                // Adds __self attribute to JSX which React
                // will use for some warnings
                _IS_DEV_ ? 'transform-react-jsx-self' : 'transform-react-inline-elements',
                // Hoist JSX elements to the highest possible scope
                // @see: https://github.com/babel/babel/tree/master/packages/babel-plugin-transform-react-constant-elements
                // Adds component stack to warning messages
                _IS_DEV_ ? 'transform-react-jsx-source' : 'transform-react-constant-elements',
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
      _IS_SERVER_
        ? new webpack.BannerPlugin({
            banner: 'require("source-map-support").install();',
            raw: true,
            entryOnly: false,
          })
        : null,

      // only want a single file for server since it's essentially just a middleware
      _IS_SERVER_ ? new webpack.optimize.LimitChunkCountPlugin({ maxChunks: 1 }) : null,
      // minify w/ babel minify
      _IS_PROD_ && _IS_CLIENT_ ? new BabelMinifyPlugin({}, { comments: false }) : null,
      _IS_PROD_ && _IS_SERVER_
        ? new BabelMinifyPlugin(
            {
              booleans: false,
              deadcode: true,
              flipComparisons: false,
              mangle: false,
              mergeVars: false,
            },
            { comments: false },
          )
        : null,

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
                'isomorphic-unfetch',
                'styled-components',
                'react-helmet',
                'serialize-javascript',
                'prop-types',
                'fontfaceobserver',
                'history',
                'react-universal-component',
              ],
            },
          })
        : null,
      // dont let errors stop us during development
      _IS_DEV_ ? new webpack.NoEmitOnErrorsPlugin() : null,
      _IS_CLIENT_ && _IS_DEV_ ? new webpack.HotModuleReplacementPlugin() : null,
      // Service worker for caching assets.
      _IS_CLIENT_ && _IS_PROD_
        ? new OfflinePlugin({
            relativePaths: false,
            publicPath: process.env.PUBLIC_PATH,

            // No need to cache .htaccess. See http://mxs.is/googmp,
            // this is applied before any match in `caches` section
            excludes: ['.htaccess', 'report.html', 'stats.json'],

            caches: {
              main: [':rest:'],
            },

            // Removes warning for about `additional` section usage
            safeToUseOptionalCaches: true,

            AppCache: false,
          })
        : null,
      // Get useful information regarding whats in our bundles...
      _IS_CLIENT_ && _IS_PROD_ && config.analyzeClientBundle
        ? new BundleAnalyzerPlugin.BundleAnalyzerPlugin({
            analyzerMode: 'static',
            defaultSizes: 'gzip',
            logLevel: 'silent',
            openAnalyzer: false,
            reportFilename: 'report.html',
          })
        : null,
      _IS_SERVER_ && _IS_PROD_ && config.analyzeServerBundle
        ? new BundleAnalyzerPlugin.BundleAnalyzerPlugin({
            analyzerMode: 'static',
            defaultSizes: 'parsed',
            logLevel: 'silent',
            openAnalyzer: false,
            reportFilename: 'report.html',
          })
        : null,
    ].filter(Boolean),
  };
}
