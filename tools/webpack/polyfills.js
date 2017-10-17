require('es6-promise').polyfill();

// fetch() polyfill for making API calls.
require('isomorphic-unfetch/browser');
require('core-js/fn/symbol');
require('core-js/fn/object/create');
require('raf').polyfill();
// Object.assign() is commonly used with React.
// It will use the native implementation if it's present and isn't buggy.
Object.assign = require('object-assign');
