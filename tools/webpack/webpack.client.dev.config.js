import path from 'path';
import NoEmitOnErrorsPlugin from 'webpack/lib/NoEmitOnErrorsPlugin';
import NamedModulesPlugin from 'webpack/lib/NamedModulesPlugin';
import HotModuleReplacementPlugin from 'webpack/lib/HotModuleReplacementPlugin';
import CircularDependencyPlugin from 'circular-dependency-plugin';
import AssetsPlugin from 'assets-webpack-plugin';
import WebpackMd5Hash from 'webpack-md5-hash';

import paths from '../config/paths';
import happyPackPlugin from './plugins/happyPackPlugin';

const debug = require('debug')('webpack:client:dev');

module.exports = options => {
  debug('Building client dev bundle');
  const main = [
    'react-hot-loader/patch',
    `webpack-hot-middleware/client?reload=true&&path=http://${options.serverHost}:${options.hmrPort}/__webpack_hmr`, // eslint-disable-line
    `${paths.clientSrcDir}/index.js`,
  ];

  return {
    target: 'web',
    devtool: 'cheap-module-eval-source-map',
    entry: {
      main,
    },
    output: {
      path: paths.assetsDir,
      filename: 'main.js',
      pathinfo: true,
      chunkFilename: '[name]-[chunkhash].js',
      publicPath: options.publicPath,
    },
    // Include polyfills and/or mocks for node features unavailable in browser
    // environments. These are typically necessary because package's will
    // occasionally include node only code.
    node: {
      fs: 'empty',
      net: 'empty',
      tls: 'empty',
    },
    plugins: [
      /**
       * HappyPack Plugins are used as caching mechanisms to reduce the amount
       * of time Webpack spends rebuilding, during your bundling during
       * development.
       * @see tools/webpack/plugins/happyPackPlugin for more info
       * @type {String}   The HappyPack loader id
       */
      happyPackPlugin('happyjs', [
        {
          loader: 'babel-loader',
          options: {
            // Dont use babelrc, instead we will use the babel config below
            babelrc: false,
            // Transpile code faster by relaxing formatting
            compact: true,
            sourceMaps: true,
            // Do we need comments in our transpiled code? Doubtful.
            comments: false,
            // Cache some babel output in node_modules/.cache for
            // an increase in speed.
            cacheDirectory: true,
            presets: [
              [
                'env',
                {
                  // Disable polyfill transforms or include polyfill.io
                  // I've opted to include polyfill.io to only provide what
                  // is needed.
                  useBuiltIns: true,
                  // enable debug to see what babel is using
                  debug: false,
                  // Prevent transforming to commonjs
                  modules: false,
                  targets: {
                    node: 'current',
                  },
                },
              ],
              'react',
            ],
            plugins: [
              // Babel will understand flowtype
              'syntax-flow',
              // Babel will understand import()
              'syntax-dynamic-import',
              // static defaultProps = {} or state = {}
              'transform-class-properties',
              // ...foo
              [
                'transform-object-rest-spread',
                {
                  useBuiltIns: true,
                },
              ],
              // @connect()
              // class Foo extends Component {}
              'transform-decorators-legacy',
              [
                'transform-runtime',
                {
                  helpers: true,
                  polyfill: false,
                  regenerator: false,
                },
              ],
              [
                'transform-regenerator',
                {
                  // babel-preset-env handles async to generator
                  async: false,
                },
              ],

              'dynamic-import-webpack',
              // Adds component stack to warning messages
              'transform-react-jsx-source',
              // Adds __self attribute to JSX which React
              // will use for some warnings
              'transform-react-jsx-self',
            ],
          },
        },
      ]),
      happyPackPlugin('happyscss', [
        {
          loader: 'style-loader',
        },
        {
          loader: 'css-loader',
          options: {
            autoprefixer: false,
            // toggle this to enable/disable cssModules
            modules: false,
            // the value here informs Webpack there are two additional
            // loaders after this one.
            importLoaders: 2,
            localIdentName: '[name]__[local]__[hash:base64:5]',
          },
        },
        {
          loader: 'postcss-loader',
        },
        // Tremendous speed increases when compiling SCSS/Sass files.
        // However, by doing so, sacrifices are made.
        // @NOTE: No loader config options or source maps
        // https://github.com/yibn2008/fast-sass-loader
        {
          loader: 'fast-sass-loader',
        },
      ]),
      happyPackPlugin('happycss', [
        {
          loader: 'style-loader',
        },
        {
          loader: 'css-loader',
          options: {
            autoprefixer: false,
            modules: true,
            importLoaders: 1,
            localIdentName: '[name]__[local]__[hash:base64:5]',
          },
        },
        {
          loader: 'postcss-loader',
        },
      ]),
      new WebpackMd5Hash(),
      new CircularDependencyPlugin({
        exclude: /a\.js|node_modules/,
        // show a warning when there is a circular dependency
        failOnError: false,
      }),
      // Prevent webpack errors during development in order to
      // keep our process alive.
      new NoEmitOnErrorsPlugin(),
      // Prints more readable module names in the browser console on HMR updates
      new NamedModulesPlugin(),
      // Generates a JSON file containing a map of all the output files
      new AssetsPlugin({
        filename: options.clientAssetsFile,
        path: paths.assetsDir,
        prettyPrint: true,
      }),
      new HotModuleReplacementPlugin(),
    ],
    module: {
      rules: [
        {
          test: /\.(js|jsx)$/,
          loader: 'happypack/loader',
          options: {
            id: 'happyjs',
          },
          exclude: [
            /node_modules/,
            paths.happyPackDir,
            paths.assetsDir,
            paths.serverCompiledDir,
          ],
          include: [paths.srcDir],
        },
        {
          test: /\.scss$/,
          loader: 'happypack/loader',
          options: {
            id: 'happyscss',
          },
        },
        {
          test: /\.css$/,
          loader: 'happypack/loader',
          options: {
            id: 'happycss',
          },
        },
      ],
    },
  };
};
