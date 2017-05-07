import path from 'path';
import NoEmitOnErrorsPlugin from 'webpack/lib/NoErrorsPlugin';
import LimitChunkCountPlugin from 'webpack/lib/optimize/LimitChunkCountPlugin';
import BannerPlugin from 'webpack/lib/BannerPlugin';
import WebpackMd5Hash from 'webpack-md5-hash';
import nodeExternals from 'webpack-node-externals';
import {removeNil, mergeDeep, ifElse} from 'boldr-utils';
import paths from '../config/paths';

const debug = require('debug')('webpack:server:dev');

module.exports = options => {
  debug('Building server dev bundle');
  return {
    target: 'node',
    externals: [
      nodeExternals({
        whitelist: [
          /\.(eot|woff|woff2|ttf|otf)$/,
          /\.(svg|png|jpg|jpeg|gif|ico)$/,
          /\.(mp4|mp3|ogg|swf|webp)$/,
          /\.(css|scss|sass|styl|less)$/,
          'source-map-support/register',
        ],
      }),
    ],
    entry: {
      main: [`${paths.serverSrcDir}/index.js`],
    },
    output: {
      path: paths.serverCompiledDir,
      filename: '[name].js',
      pathinfo: true,
      chunkFilename: '[name]-[chunkhash].js',
      publicPath: options.publicPath,
      libraryTarget: 'commonjs2',
    },
    module: {
      rules: [
        {
          test: /\.(js|jsx)$/,
          loader: 'babel-loader',
          exclude: [
            /node_modules/,
            paths.serverCompiledDir,
            paths.assetsDir,
            paths.happyPackDir,
          ],
          include: [paths.srcDir],
          options: {
            babelrc: false,
            cacheDirectory: false,
            compact: true,
            sourceMaps: true,
            comments: false,
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
              'dynamic-import-node',
            ],
          },
        },
        {
          test: /\.(scss|css)$/,
          use: [
            {
              loader: 'css-loader/locals',
            },
            {
              loader: 'postcss-loader',
            },
            {
              loader: 'sass-loader',
            },
          ],
        },
      ],
    },

    plugins: [
      new WebpackMd5Hash(),
      new NoEmitOnErrorsPlugin(),
      new LimitChunkCountPlugin({
        maxChunks: 1,
      }),
      new BannerPlugin({
        banner: 'require("source-map-support").install();',
        raw: true,
        entryOnly: true,
      }),
    ],
  };
};
