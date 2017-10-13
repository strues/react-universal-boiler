import webpack from 'webpack';
import chalk from 'chalk';

export default (webpackConfig, cb) => {
  let webpackCompiler;
  const buildTarget = webpackConfig.target === 'web' ? 'client' : 'server';

  // Compile the webpack config
  try {
    webpackCompiler = webpack(webpackConfig);
    console.log(chalk.cyan(`\n Building the ${buildTarget}. \n`));
  } catch (error) {
    console.error(chalk.red(`${buildTarget} webpack config is invalid\n`, error));
    console.log(error);
    process.exit(1);
  }

  // Handle errors in webpack build
  webpackCompiler.plugin('done', stats => {
    if (stats.hasErrors()) {
      console.error(chalk.red(`${buildTarget} build failed\n`, stats.toString()));
      console.info(chalk.bgMagenta('See webpack error above'));
    } else if (stats.hasWarnings()) {
      console.warn(chalk.yellow(`${buildTarget} build warnings`, stats.toString()));
    } else {
      console.log(`${buildTarget} build successful`);
    }

    if (cb) {
      cb(stats);
    }
  });

  // Return the compiler
  return webpackCompiler;
};
