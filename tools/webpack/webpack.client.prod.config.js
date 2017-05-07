import path from 'path';
import glob from 'glob';
import CommonsChunkPlugin from 'webpack/lib/optimize/CommonsChunkPlugin';
import HashedModuleIdsPlugin from 'webpack/lib/HashedModuleIdsPlugin';
import AggressiveMergingPlugin from 'webpack/lib/optimize/AggressiveMergingPlugin'; // eslint-disable-line
import ExtractTextPlugin from 'extract-text-webpack-plugin';
import AssetsPlugin from 'assets-webpack-plugin';
import {BundleAnalyzerPlugin} from 'webpack-bundle-analyzer';
import ChunkManifestPlugin from 'chunk-manifest-webpack-plugin';
import BabiliWebpackPlugin from 'babili-webpack-plugin';
import WebpackMd5Hash from 'webpack-md5-hash';

import config from '../config/config';
import paths from '../config/paths';

const debug = require('debug')('webpack:client:prod');

module.exports = options => {
  debug('Building client prod bundle');
  return {
    target: 'web',
    devtool: 'hidden-source-map',
    entry: {
      main: [
        `${paths.clientSrcDir}/index.js`,
      ],
      vendor: config.vendorFiles,
    },
    output: {
      path: paths.assetsDir,
      pathinfo: false,
      filename: '[name]-[chunkhash].js',
      chunkFilename: '[name]-[chunkhash].js',
      publicPath: options.publicPath,
      libraryTarget: 'var',
    },
    node: {
      __dirname: true,
      __filename: true,
      fs: 'empty',
      global: true,
      crypto: 'empty',
    },
    module: {
      rules: [
        {
          test: /\.(js|jsx)$/,
          loader: 'babel-loader',
          exclude: [/node_modules/, paths.assetsDir],
          options: {
            babelrc: false,
            compact: true,
            sourceMaps: true,
            comments: false,
            cacheDirectory: false,
            presets: [
              ['env', {
                useBuiltIns: true,
                debug: false,
                modules: false,
                targets: {
                  node: 'current',
                },
              }],
              'react',
            ],
            plugins: [
              // Babel will understand flowtype
              'syntax-flow',
              // Babel will understand import()
              'syntax-dynamic-import',
              'transform-class-properties',
              ['transform-object-rest-spread', {
                useBuiltIns: true,
              }],
              'transform-decorators-legacy',
              ['transform-runtime', {
                helpers: true,
                polyfill: false,
                regenerator: true,
              }],
              ['transform-regenerator', {
                // babel-preset-env handles async to generator
                async: false,
              }],
              'dynamic-import-webpack',
            ],
          },
        },
        {
          test: /\.css$/,
          loader: ExtractTextPlugin.extract({
            fallback: 'style-loader',
            use: [
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
            ],
          }),
        },
        {
          test: /\.scss$/,
          loader: ExtractTextPlugin.extract({
            fallback: 'style-loader',
            use: [
              {
                loader: 'css-loader',
                options: {
                  modules: false,
                  minimize: true,
                  autoprefixer: false,
                  importLoaders: 2,
                  localIdentName: '[hash:base64]',
                },
              },
              {
                loader: 'postcss-loader',
              },
              {
                loader: 'sass-loader',
              },
            ],
          }),
        },
      ],
    },

    plugins: [
      new WebpackMd5Hash(),
      new ExtractTextPlugin({
        filename: '[name]-[chunkhash].css',
        allChunks: true,
      }),
      new CommonsChunkPlugin({
        name: 'vendor',
        minChunks: module => /node_modules/.test(module.resource),
      }),
      new BabiliWebpackPlugin(),

      new BundleAnalyzerPlugin({
        openAnalyzer: false,
        analyzerMode: 'static',
        logLevel: 'error',
      }),
      new HashedModuleIdsPlugin(),

      new AggressiveMergingPlugin(),
      new ChunkManifestPlugin({
        filename: 'manifest.json',
        manifestVariable: 'CHUNK_MANIFEST',
      }),
      new AssetsPlugin({
        filename: 'assets.json',
        path: paths.assetsDir,
      }),
    ],
  };
};
