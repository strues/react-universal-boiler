const webpack = require('webpack');

module.exports = (webpackConfig, cb) => {
  let webpackCompiler;
  const type = webpackConfig.target === 'web' ? 'client' : 'server';

  // Compile the webpack config
  try {
    webpackCompiler = webpack(webpackConfig);
    console.log(`${type} webpack configuration compiled`);
  } catch (error) {
    console.error(`${type} webpack config is invalid\n`, error);
    console.log(error);
    process.exit(1);
  }

  // Handle errors in webpack build
  webpackCompiler.plugin('done', stats => {
    if (stats.hasErrors()) {
      console.error(`${type} build failed\n`, stats.toString());
      console.info('See webpack error above');
    } else if (stats.hasWarnings()) {
      console.warn(`${type} build warnings`, stats.toString());
    } else {
      console.log(`${type} build successful`);
    }

    if (cb) {
      cb(stats);
    }
  });

  // Return the compiler
  return webpackCompiler;
};
