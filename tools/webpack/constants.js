/* eslint-disable camelcase */
export const CACHE_HASH_TYPE = 'sha256';
export const CACHE_DIGEST_TYPE = 'base62';
export const CACHE_DIGEST_LENGTH = 4;

export const JS_FILES = /\.(js|mjs|jsx|js.flow)$/;
export const STYLE_FILES = /\.(css|scss|pcss)$/;
export const ASSET_FILES = /\.(eot|woff|woff2|ttf|otf|svg|png|jpg|jpeg|jp2|jpx|jxr|gif|webp|mp4|mp3|ogg|pdf|html|ico)$/;

export const REQUIRED_ENV_VARS = [
  'SERVER_ENTRY',
  'CLIENT_ENTRY',
  'VENDOR_FILE',
  'SERVER_OUTPUT',
  'CLIENT_OUTPUT',
  'PUBLIC_PATH',
  'PORT',
];

// CSS Nano options http://cssnano.co/
export const CSSNANO_OPT = {
  discardComments: { removeAll: true },
};

export const VENDOR_FILES = [
  'react',
  'react-dom',
  'react-router-dom',
  'redux',
  'react-redux',
  'redux-thunk',
  'isomorphic-unfetch/browser',
  'styled-components',
  'react-helmet',
  'serialize-javascript',
  'fontfaceobserver',
  'history',
  'react-universal-component',
];
