import path from 'path';
import LimitChunkCountPlugin from 'webpack/lib/optimize/LimitChunkCountPlugin';
import BannerPlugin from 'webpack/lib/BannerPlugin';
import nodeExternals from 'webpack-node-externals';
import WebpackMd5Hash from 'webpack-md5-hash';
import paths from '../config/paths';

const debug = require('debug')('webpack:server:prod');

module.exports = options => {
  debug('Building server prod bundle');
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
      pathinfo: false,
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
                helpers: false,
                polyfill: false,
                regenerator: true,
              }],
              ['transform-regenerator', {
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
              loader: 'fast-sass-loader',
            },
          ],
        },
      ],
    },

    plugins: [
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
