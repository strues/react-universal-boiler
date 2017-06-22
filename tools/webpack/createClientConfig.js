/* eslint-disable max-lines, prefer-template */

const path = require('path');
const fs = require('fs');
const debug = require('debug')('webpack:clientConfig');
const webpack = require('webpack');
const StatsPlugin = require('stats-webpack-plugin');
const { removeNil, ifElse, mergeDeep, filterEmpty, appRoot, onlyIf } = require('boldr-utils');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const AssetsPlugin = require('assets-webpack-plugin');
const BabiliPlugin = require('babili-webpack-plugin');
const UglifyPlugin = require('uglifyjs-webpack-plugin');
const ChunkManifestPlugin = require('chunk-manifest-webpack-plugin');
const CaseSensitivePathsPlugin = require('case-sensitive-paths-webpack-plugin');
const CircularDependencyPlugin = require('circular-dependency-plugin');

const config = require('../config');
const happyPackPlugin = require('./plugins/happyPackPlugin');

const LOCAL_IDENT = '[name]__[local]___[hash:base64:5]';
const EXCLUDES = [/node_modules/, config.assetsDir, config.serverCompiledDir];

module.exports = function createClientConfig(options) {
  const _DEV = process.env.NODE_ENV === 'development';
  const _PROD = process.env.NODE_ENV === 'production';

  const ifDev = ifElse(_DEV);
  const ifProd = ifElse(_PROD);

  const getEntry = () => {
    // For development
    let entry = {
      main: [
        'react-hot-loader/patch',
        `webpack-hot-middleware/client?path=http://localhost:${config.serverPort}/__webpack_hmr&timeout=20000&reload=false&quiet=false&noInfo=false`,
        `${config.srcDir}/client.js`,
      ],
    };
    // For prodcution
    if (!_DEV) {
      entry = {
        main: [`${config.srcDir}/client.js`],
        vendor: config.vendorFiles,
      };
    }

    return entry;
  };
  const browserConfig = {
    name: 'client',
    // pass either node or web
    target: 'web',
    // user's project root
    context: config.rootDir,
    // sourcemap
    devtool: _DEV ? 'cheap-module-eval-source-map' : 'source-map',
    entry: getEntry(),
    output: {
      // build/assets/*
      path: config.assetsDir,
      filename: _DEV ? '[name].js' : '[name]-[chunkhash].js',
      chunkFilename: _DEV ? '[name]-[hash].js' : '[name]-[chunkhash].js',
      // Full URL in dev otherwise we expect our bundled output to be served from /assets/
      publicPath: '/',
      // only dev
      pathinfo: _DEV,
      libraryTarget: 'var',
      strictModuleExceptionHandling: true,
      devtoolModuleFilenameTemplate: info => path.resolve(info.absoluteResourcePath),
    },
    // fail on err
    bail: _PROD,
    // cache dev
    // Cache the generated webpack modules and chunks to improve build speed.
    cache: _DEV,
    // true if prod & enabled in settings
    profile: !_DEV,
    // Include polyfills and/or mocks for node features unavailable in browser
    // environments. These are typically necessary because package's will
    // occasionally include node only code.
    node: {
      fs: 'empty',
      net: 'empty',
      tls: 'empty',
    },
    performance: {
      hints: _PROD ? 'warning' : false,
      maxAssetSize: 1000000,
      maxEntrypointSize: 1000000,
    },
    stats: {
      colors: true,
      reasons: config.isVerbose,
      hash: config.isVerbose,
      version: config.isVerbose,
      timings: true,
      chunks: config.isVerbose,
      chunkModules: config.isVerbose,
      cached: config.isVerbose,
      cachedAssets: config.isVerbose,
    },
    resolve: {
      // look for files in the descendants of src/ then node_modules
      modules: [config.srcDir, 'node_modules'],
      // Webpack will look for the following fields when searching for libraries
      mainFields: ['web', 'browser', 'style', 'module', 'jsnext:main', 'main'],
      descriptionFiles: ['package.json'],
      // We want files with the following extensions...
      extensions: ['.js', '.json', '.jsx', '.css', '.scss'],
    },
    // Locations Webpack should look for loaders.
    // You can also use the resolveLoader to resolve you're webpack 2/3 loaders
    // without the -loader
    resolveLoader: {
      modules: [config.nodeModules, config.srcDir],
      moduleExtensions: ['-loader'],
    },
    module: {
      strictExportPresence: true,
      // dont parse minimized files
      noParse: [/\.min\.js/],
      rules: removeNil([
        // js
        {
          test: /\.(js|jsx)$/,
          exclude: EXCLUDES,
          include: [config.srcDir],
          use: removeNil([
            ifDev({
              loader: 'cache-loader',
              options: {
                cacheDirectory: path.resolve(config.nodeModules, '.cache'),
              },
            }),
            { loader: 'happypack/loader?id=hp-js' },
          ]),
        },
        // css
        {
          test: /\.css$/,
          exclude: EXCLUDES,
          include: config.srcDir,
          use: _DEV
            ? { loader: 'happypack/loader?id=hp-css' }
            : ExtractTextPlugin.extract({
                fallback: 'style-loader',
                use: [
                  {
                    loader: 'css-loader',
                    options: {
                      modules: true,
                      minimize: true,
                      autoprefixer: false,
                      importLoaders: 2,
                      context: config.rootDir,
                      localIdentName: '[hash:base64:5]',
                    },
                  },
                  {
                    loader: 'resolve-url-loader',
                  },
                  {
                    loader: 'postcss-loader',
                    options: {
                      // https://webpack.js.org/guides/migrating/#complex-options
                      ident: 'postcss',
                      sourceMap: false,
                      plugins: () => [
                        require('postcss-import')({
                          root: config.rootDir,
                        }),
                        require('postcss-flexbugs-fixes'),
                        require('postcss-cssnext')({
                          browsers: ['>.5% in US', 'last 1 versions'],
                          flexbox: 'no-2009',
                        }),
                        require('postcss-discard-duplicates'),
                      ],
                    },
                  },
                ],
              }),
        },
        // scss
        {
          test: /\.scss$/,
          include: config.srcDir,
          exclude: EXCLUDES,
          use: _DEV
            ? { loader: 'happypack/loader?id=hp-scss' }
            : ExtractTextPlugin.extract({
                fallback: require.resolve('style-loader'),
                use: [
                  {
                    loader: 'css-loader',
                    options: {
                      modules: false,
                      minimize: true,
                      autoprefixer: false,
                      importLoaders: 3,
                      context: config.rootDir,
                      localIdentName: '[hash:base64:5]',
                    },
                  },
                  {
                    loader: 'resolve-url-loader',
                  },
                  {
                    loader: 'postcss-loader',
                    options: {
                      // https://webpack.js.org/guides/migrating/#complex-options
                      ident: 'postcss',
                      sourceMap: false,
                      plugins: () => [
                        require('postcss-import')({
                          root: config.rootDir,
                        }),
                        require('postcss-flexbugs-fixes'),
                        require('postcss-cssnext')({
                          browsers: ['>.5% in US', 'last 1 versions'],
                          flexbox: 'no-2009',
                        }),
                        require('postcss-discard-duplicates'),
                      ],
                    },
                  },
                  {
                    loader: 'sass-loader',
                    options: {
                      sourceMap: false,
                      includePaths: [config.srcDir],
                      outputStyle: 'compressed',
                    },
                  },
                ],
              }),
        },
      ]),
    },
    plugins: removeNil([
      new webpack.LoaderOptionsPlugin({
        minimize: _PROD,
        debug: _DEV,
        context: config.rootDir,
      }),
      // EnvironmentPlugin is essentially DefinePlugin but allows you to
      // forgo the process.env. when defining.
      // Anything placed in EnvironmentPlugin / DefinePlugin will be
      // inlined when compiled with Webpack.
      new webpack.EnvironmentPlugin({
        NODE_ENV: JSON.stringify(process.env.NODE_ENV),
        DEBUG: JSON.stringify(process.env.DEBUG || false),
      }),
      new webpack.DefinePlugin({
        IS_DEV: JSON.stringify(_DEV),
        IS_SERVER: JSON.stringify('false'),
        IS_CLIENT: JSON.stringify('true'),
        ASSETS_MANIFEST: JSON.stringify(
          path.join(config.assetsDir || '', 'assets-manifest.json' || ''),
        ),
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
              compact: true,
              sourceMaps: true,
              comments: false,
              cacheDirectory: !!_DEV,
              presets: [
                [
                  'env',
                  {
                    useBuiltins: true,
                    modules: false,
                    exclude: ['transform-regenerator', 'transform-async-to-generator'],
                    targets: {
                      uglify: !_DEV && !config.useBabili,
                      browsers: ['> .5% in US', 'last 1 versions'],
                    },
                  },
                ],
                'react',
              ],
              plugins: removeNil([
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

                'dynamic-import-webpack',
                // Adds component stack to warning messages
                ifDev('transform-react-jsx-source'),
                // Adds __self attribute to JSX which React
                // will use for some warnings
                ifDev('transform-react-jsx-self'),
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
              ]),
            },
          },
        ],
      }),
      new AssetsPlugin({
        filename: 'assets-manifest.json',
        path: config.assetsDir,
        fullPath: true,
        prettyPrint: true,
      }),
    ]),
  };

  if (_DEV) {
    browserConfig.plugins.push(
      // Dont let errors stop our processes during development
      new webpack.NoEmitOnErrorsPlugin(),
      // Hot reloading
      new webpack.HotModuleReplacementPlugin(),
      // Readable module names for development
      // https://github.com/webpack/webpack.js.org/issues/652#issuecomment-273023082
      new webpack.NamedModulesPlugin(),
      // happypack Css
      happyPackPlugin({
        name: 'hp-css',
        loaders: [
          {
            path: 'style-loader',
          },
          {
            path: 'css-loader',
            use: {
              autoprefixer: false,
              modules: true,
              importLoaders: 2,
              localIdentName: LOCAL_IDENT,
              context: config.rootDir,
            },
          },
          { path: 'resolve-url-loader' },
          {
            path: 'postcss-loader',
            use: {
              // https://webpack.js.org/guides/migrating/#complex-options
              ident: 'postcss',
              plugins: () => [
                require('postcss-import')({
                  root: path.resolve(config.rootDir),
                }),
                require('postcss-flexbugs-fixes'),
                require('postcss-cssnext')({
                  browsers: ['> .5% in US', 'last 1 versions'],
                  flexbox: 'no-2009',
                }),
                require('postcss-discard-duplicates'),
              ],
            },
          },
        ],
      }),
      // happypackScss
      happyPackPlugin({
        name: 'hp-scss',
        loaders: [
          { path: 'style-loader' },
          {
            path: 'css-loader',
            use: {
              importLoaders: 3,
              localIdentName: LOCAL_IDENT,
              sourceMap: true,
              modules: false,
              context: config.rootDir,
            },
          },
          {
            loader: 'resolve-url-loader',
          },
          {
            loader: 'postcss-loader',
            use: {
              // https://webpack.js.org/guides/migrating/#complex-options
              ident: 'postcss',
              parser: 'postcss-scss',
              options: {
                sourceMap: true,
              },
              plugins: () => [
                require('postcss-flexbugs-fixes'),
                require('postcss-cssnext')({
                  browsers: ['> 1%', 'last 2 versions'],
                  flexbox: 'no-2009',
                }),
                require('postcss-discard-duplicates'),
              ],
            },
          },
          {
            path: 'sass-loader',
            options: {
              sourceMap: true,
              includePaths: [config.srcDir],
            },
          },
        ],
      }),
      // Detect modules with circular dependencies when bundling with webpack.
      // @see https://github.com/aackerman/circular-dependency-plugin
      new CircularDependencyPlugin({
        // exclude detection of files based on a RegExp
        exclude: /a\.js|node_modules/,
        // add errors to webpack instead of warnings
        failOnError: false,
      }),
      // Improve OS compatibility
      // @see https://github.com/Urthen/case-sensitive-paths-webpack-plugin
      new CaseSensitivePathsPlugin(),
      // Dll reference speeds up development by grouping all of your vendor dependencies
      // in a DLL file. This is not compiled again, unless package.json contents
      // have changed.
      new webpack.DllReferencePlugin({
        context: config.rootDir,
        manifest: require(path.resolve(config.assetsDir, '__vendor_dlls__.json')),
      }),
    );
  }
  if (_PROD) {
    browserConfig.plugins.push(
      // Use HashedModuleIdsPlugin to generate IDs that preserves over builds
      // @see https://github.com/webpack/webpack.js.org/issues/652#issuecomment-273324529
      new webpack.HashedModuleIdsPlugin(),
      // Webpack 3 scope hoisting feature
      new webpack.optimize.ModuleConcatenationPlugin(),
      new webpack.optimize.CommonsChunkPlugin({
        name: 'vendor',
        minChunks(module) {
          // A module is extracted into the vendor chunk when...
          return (
            // If it's inside node_modules
            /node_modules/.test(module.context) &&
            // Do not externalize if the request is a CSS file
            !/\.(css|pcss|scss)$/.test(module.request)
          );
        },
      }),
      new webpack.optimize.CommonsChunkPlugin({
        name: 'common',
        minChunks: Infinity,
      }),
      new webpack.optimize.CommonsChunkPlugin({
        async: true,
        children: true,
        minChunks: 4,
      }),
      new ExtractTextPlugin({
        filename: '[name]-[contenthash:8].css',
        allChunks: true,
      }),
      new ChunkManifestPlugin({
        filename: 'chunk-manifest.json',
        manifestVariable: 'CHUNK_MANIFEST',
      }),
      new StatsPlugin('stats.json'),
      config.useBabili
        ? new BabiliPlugin()
        : new UglifyPlugin({
            compress: true,
            mangle: true,
            comments: false,
            sourceMap: true,
          }),
    );
  }
  return browserConfig;
};
