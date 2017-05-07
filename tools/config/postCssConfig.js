const path = require('path');
const autoprefixer = require('autoprefixer');
const reporter = require('postcss-reporter');

function postCssConfig(variables = {}) {
  return [
    autoprefixer({
      browsers: ['> 1%', 'last 2 versions'],
    }),
    reporter(),
  ];
}
module.exports = postCssConfig;
