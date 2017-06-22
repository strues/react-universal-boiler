/* eslint-disable max-lines, prefer-template */
const path = require('path');
const fs = require('fs');
const debug = require('debug')('webpack:serverConfig');
const webpack = require('webpack');
const { removeNil, ifElse } = require('boldr-utils');
const nodeExternals = require('webpack-node-externals');
const CaseSensitivePathsPlugin = require('case-sensitive-paths-webpack-plugin');
const CircularDependencyPlugin = require('circular-dependency-plugin');
const config = require('../config');

const CWD = fs.realpathSync(process.cwd());

const cache = {
  'server-production': {},
  'server-development': {},
};
const EXCLUDES = [/node_modules/, config.assetsDir, config.serverCompiledDir];
// This is the Webpack configuration for Node
module.exports = function createServerConfig(options) {
  // debug(boldrRoot.toString());
  const _DEV = process.env.NODE_ENV === 'development';
  const _PROD = process.env.NODE_ENV === 'production';
  const ifDev = ifElse(_DEV);
  const ifProd = ifElse(_PROD);

  const nodeConfig = {
    // pass either node or web
    target: 'node',
    name: 'server',
    // user's project root
    context: config.rootDir,
    // sourcemap
    devtool: '#source-map',
    entry: [`${config.srcDir}/server.js`],
    output: {
      path: config.serverCompiledDir,
      filename: 'server.js',
      sourcePrefix: '  ',
      publicPath: '/',
      // only prod
      pathinfo: _DEV,
      libraryTarget: 'commonjs2',
      devtoolModuleFilenameTemplate: info => path.resolve(info.absoluteResourcePath),
    },
    // true if prod
    bail: _PROD,
    // cache dev
    cache: _DEV,
    // true if prod & enabled in settings
    profile: false,
    node: {
      console: false,
      __filename: true,
      __dirname: true,
      fs: false,
    },
    performance: false,
    resolve: {
      extensions: ['.js', '.json', '.jsx'],
      modules: [config.srcDir, 'node_modules'],
      mainFields: ['module', 'jsnext:main', 'main'],
    },
    resolveLoader: {
      modules: [config.nodeModules, config.srcDir],
      moduleExtensions: ['-loader'],
    },
    externals: nodeExternals({
      whitelist: [
        'source-map-support/register',
        'react-loadable',
        /\.(eot|woff|woff2|ttf|otf)$/,
        /\.(svg|png|jpg|jpeg|gif|ico)$/,
        /\.(mp4|mp3|ogg|swf|webp)$/,
        /\.(css|scss)$/,
      ],
      modulesDir: config.nodeModules,
    }),
    module: {
      noParse: [/\.min\.js/],
      strictExportPresence: true,
      rules: [
        // js
        {
          test: /\.js$/,
          include: config.srcDir,
          // exclude: EXCLUDES,
          use: removeNil([
            ifDev({
              loader: 'cache-loader',
              options: {
                cacheDirectory: path.resolve(config.nodeModules, '.cache'),
              },
            }),
            {
              loader: 'babel-loader',
              options: {
                babelrc: false,
                compact: true,
                sourceMaps: true,
                comments: false,
                cacheDirectory: _DEV,
                presets: [
                  [
                    'env',
                    {
                      debug: false,
                      useBuiltins: true,
                      modules: false,
                      targets: {
                        node: config.nodeTarget,
                      },
                      exclude: ['transform-regenerator', 'transform-async-to-generator'],
                    },
                  ],
                  'react',
                ],
                plugins: [
                  // Babel will understand import()
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
                  // @connect()
                  // class Foo extends Component {}
                  'transform-decorators-legacy',

                  // ...foo
                  [
                    'transform-object-rest-spread',
                    {
                      useBuiltIns: true,
                    },
                  ],
                  // @NOTE:
                  // Dont want to use styled-components?
                  // remove this babel plugin
                  [
                    'babel-plugin-styled-components',
                    {
                      ssr: true,
                    },
                  ],
                  // @NOTE:
                  // Dont want to use react-loadable?
                  // remove this babel plugin
                  [
                    'babel-plugin-import-inspector',
                    {
                      serverSideRequirePath: true,
                      webpackRequireWeakId: true,
                    },
                  ],
                  'dynamic-import-node',
                ],
              },
            },
          ]),
        },
        {
          test: /\.css$/,
          exclude: EXCLUDES,
          use: [
            {
              loader: 'css-loader/locals',
              options: {
                importLoaders: 1,
              },
            },
            {
              loader: 'resolve-url-loader',
            },
            { loader: 'postcss-loader' },
          ],
        },
        // scss
        {
          test: /\.scss$/,
          exclude: EXCLUDES,
          use: [
            {
              loader: 'css-loader/locals',
              options: {
                importLoaders: 1,
              },
            },
            {
              loader: 'resolve-url-loader',
            },
            { loader: 'postcss-loader' },
            { loader: 'sass-loader' },
          ],
        },
        // json
        {
          test: /\.json$/,
          loader: 'json-loader',
        },
        // url
        {
          test: /\.(png|jpg|jpeg|gif|svg|woff|woff2)$/,
          loader: 'url-loader',
          exclude: EXCLUDES,
          options: { limit: 10000, emitFile: false },
        },
        {
          test: /\.svg(\?v=\d+.\d+.\d+)?$/,
          exclude: EXCLUDES,
          loader: 'url-loader?limit=10000&mimetype=image/svg+xml&name=[name].[ext]', // eslint-disable-line
        },
        // file
        {
          test: /\.(ico|eot|ttf|otf|mp4|mp3|ogg|pdf|html)$/, // eslint-disable-line
          loader: 'file-loader',
          exclude: EXCLUDES,
          options: {
            emitFile: false,
          },
        },
      ],
    },
    plugins: [
      new webpack.LoaderOptionsPlugin({
        minimize: _PROD,
        debug: !!_DEV,
        context: config.rootDir,
      }),
      new webpack.optimize.LimitChunkCountPlugin({ maxChunks: 1 }),
      // EnvironmentPlugin is essentially DefinePlugin but allows you to
      // forgo the process.env. when defining.
      // Anything placed in EnvironmentPlugin / DefinePlugin will be
      // inlined when compiled with Webpack.
      new webpack.EnvironmentPlugin({
        NODE_ENV: _PROD ? 'production' : 'development',
        DEBUG: JSON.stringify(process.env.DEBUG || false),
      }),
      new webpack.DefinePlugin({
        IS_DEV: JSON.stringify(_DEV),
        IS_SERVER: JSON.stringify('true'),
        IS_CLIENT: JSON.stringify('false'),
        ASSETS_MANIFEST: JSON.stringify(
          path.join(config.assetsDir || '', 'assets-manifest.json' || ''),
        ),
      }),
      new webpack.BannerPlugin({
        banner: 'require("source-map-support").install();',
        raw: true,
        entryOnly: true,
      }),
    ],
  };

  if (_DEV) {
    nodeConfig.stats = 'none';
    nodeConfig.watch = true;
    nodeConfig.plugins.push(
      new CaseSensitivePathsPlugin(),
      new CircularDependencyPlugin({
        exclude: /a\.js|node_modules/,
        // show a warning when there is a circular dependency
        failOnError: false,
      }),
    );
  }
  return nodeConfig;
};
