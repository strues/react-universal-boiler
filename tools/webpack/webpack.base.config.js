/* eslint-disable quote-props */
import path from 'path';

import EnvironmentPlugin from 'webpack/lib/EnvironmentPlugin';
import DefinePlugin from 'webpack/lib/DefinePlugin';
import OccurrenceOrderPlugin from 'webpack/lib/optimize/OccurrenceOrderPlugin';
import IgnorePlugin from 'webpack/lib/IgnorePlugin';
import LoaderOptionsPlugin from 'webpack/lib/LoaderOptionsPlugin';
import CaseSensitivePathsPlugin from 'case-sensitive-paths-webpack-plugin';
import { removeNil, mergeDeep, ifElse } from 'boldr-utils';
import paths from '../config/paths';
import getPostCSSConfig from '../config/postCssConfig';

const debug = require('debug')('webpack:base');

debug('Creating configuration.');
module.exports = options => {
  debug('webpack.base -- options: ', options);
  const isDev = options.environment === 'development';
  const isProd = options.environment === 'production';
  const isClient = options.target === 'web';
  const isServer = options.target === 'node';
  const isNode = !isClient;
  const ifNode = ifElse(isNode);
  return {
    // Cache the generated webpack modules and chunks to improve build speed.
    cache: !isProd,
    resolve: {
      modules: [paths.nodeModules, paths.srcDir],
      // Webpack will look for the following fields when searching for libraries
      mainFields: ifNode(
        ['module', 'jsnext:main', 'main'],
        ['web', 'browser', 'style', 'module', 'jsnext:main', 'main'],
      ),
      // We want files with the following extensions...
      extensions: ['.js', '.json', '.jsx', '.css', '.scss'],
    },
    // Locations Webpack should look for loaders.
    resolveLoader: {
      modules: [paths.nodeModules, paths.srcDir],
      moduleExtensions: ['-loader'],
    },
    // Captures a profile (stats, hints, etc) of the app. This data can be
    // used with tools like https://webpack.github.io/analyse/
    profile: isProd,
    // Exit on the first error. Typically you only want this for prod builds.
    bail: isProd,
    //  Webpack will output an error / warning when hints are found.
    performance: {
      hints: isProd,
    },
    plugins: [
      // EnvironmentPlugin is essentially DefinePlugin but allows you to
      // forgo the process.env. when defining.
      // Anything placed in EnvironmentPlugin / DefinePlugin will be
      // inlined when compiled with Webpack.
      new EnvironmentPlugin({
        NODE_ENV: isProd ? 'production' : 'development',
        DEBUG: JSON.stringify(process.env.DEBUG || false),
      }),
      new DefinePlugin({
        IS_DEV: JSON.stringify(isDev),
        IS_SERVER: JSON.stringify(isServer),
        IS_CLIENT: JSON.stringify(isClient),
        ASSETS_MANIFEST: JSON.stringify(
          path.join(paths.assetsDir || '', options.clientAssetsFile || ''),
        ),
      }),
      // Helps with case insensitive OS like macOS where ~/Code/Project is
      // the same as ~/code/project
      new CaseSensitivePathsPlugin(),
      new IgnorePlugin(/^\.\/locale$/, /moment$/),
      new LoaderOptionsPlugin({
        minimize: isProd,
        debug: !isProd,
        quiet: false,
        options: {
          postcss: getPostCSSConfig({}),
          context: paths.rootDir,
        },
      }),
    ],

    module: {
      rules: [
        {
          test: /\.html$/,
          loader: 'file-loader?name=[name].[ext]',
        },
        {
          test: /\.woff(\?.*)?$/,
          loader: 'url?prefix=fonts/&name=[path][name].[ext]&limit=10000&mimetype=application/font-woff', // eslint-disable-line
        },
        {
          test: /\.woff2(\?.*)?$/,
          loader: 'url?prefix=fonts/&name=[path][name].[ext]&limit=10000&mimetype=application/font-woff2', // eslint-disable-line
        },
        {
          test: /\.otf(\?.*)?$/,
          loader: 'file?prefix=fonts/&name=[path][name].[ext]&limit=10000&mimetype=font/opentype', // eslint-disable-line
        },
        {
          test: /\.ttf(\?.*)?$/,
          loader: 'url?prefix=fonts/&name=[path][name].[ext]&limit=10000&mimetype=application/octet-stream', // eslint-disable-line
        },
        {
          test: /\.eot(\?.*)?$/,
          loader: 'file?prefix=fonts/&name=[path][name].[ext]',
        },
        {
          test: /\.svg(\?.*)?$/,
          loader: 'url?prefix=fonts/&name=[path][name].[ext]&limit=10000&mimetype=image/svg+xml', // eslint-disable-line
        },
        { test: /\.(png|jpg)$/, loader: 'url?limit=8192' },
      ],
    },
  };
};
