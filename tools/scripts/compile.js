import path from 'path';
import fs from 'fs-extra';
import chalk from 'chalk';
import formatWebpackMessages from 'react-dev-utils/formatWebpackMessages';
import FileSizeReporter from 'react-dev-utils/FileSizeReporter';
import printBuildError from 'react-dev-utils/printBuildError';
import dotenv from 'dotenv';
import createWebpackConfig from '../webpack/createWebpackConfig';
import webpackCompiler from '../utils/webpackCompiler';

dotenv.config();
const ROOT = fs.realpathSync(process.cwd());

const measureFileSizesBeforeBuild = FileSizeReporter.measureFileSizesBeforeBuild;

const printFileSizesAfterBuild = FileSizeReporter.printFileSizesAfterBuild;
const WARN_AFTER_BUNDLE_GZIP_SIZE = 512 * 1024;
const WARN_AFTER_CHUNK_GZIP_SIZE = 1024 * 1024;

let serverCompiler, clientCompiler;

const clientConfig = createWebpackConfig({
  target: 'client',
  env: 'production',
});

const serverConfig = createWebpackConfig({
  target: 'server',
  env: 'production',
});
const clientOut = process.env.CLIENT_OUTPUT;
const serverOut = process.env.SERVER_OUTPUT;
const buildPath = path.resolve(ROOT, clientOut);
const serverPath = path.resolve(ROOT, serverOut);

measureFileSizesBeforeBuild(buildPath)
  .then(previousFileSizes => {
    // Remove all content but keep the directory so that
    // if you're in it, you don't end up in Trash
    fs.emptyDirSync(buildPath);
    fs.emptyDirSync(serverPath);
    // Start the webpack build
    return build(previousFileSizes);
  })
  .then(
    ({ stats, previousFileSizes, warnings }) => {
      if (warnings.length) {
        console.log(chalk.yellow('Compiled with warnings.\n'));
        console.log(warnings.join('\n\n'));
        console.log(
          `\nSearch for the ${chalk.underline(
            chalk.yellow('keywords'),
          )} to learn more about each warning.`,
        );
        console.log(
          `To ignore, add ${chalk.cyan('// eslint-disable-next-line')} to the line before.\n`,
        );
      } else {
        console.log(chalk.green('Compiled successfully.\n'));
      }

      console.log('File sizes after gzip:\n');
      printFileSizesAfterBuild(
        stats,
        previousFileSizes,
        buildPath,
        WARN_AFTER_BUNDLE_GZIP_SIZE,
        WARN_AFTER_CHUNK_GZIP_SIZE,
      );
      console.log();
    },
    err => {
      console.log(chalk.red('Failed to compile.\n'));
      printBuildError(err);
      process.exit(1);
    },
  );

function build(previousFileSizes) {
  const buildServer = () => {
    serverCompiler = webpackCompiler(serverConfig, stats => {
      if (stats.hasErrors()) {
        console.info(stats.hasErrors());
        process.exit(1);
      }
      console.log('Built server.');
    });
    serverCompiler.run(() => undefined);
  };
  clientCompiler = webpackCompiler(clientConfig);
  return new Promise((resolve, reject) => {
    clientCompiler.run((err, stats) => {
      if (err) {
        return reject(err);
      }
      buildServer();
      const messages = formatWebpackMessages(stats.toJson({}, true));
      if (messages.errors.length) {
        // Only keep the first error. Others are often indicative
        // of the same problem, but confuse the reader with noise.
        if (messages.errors.length > 1) {
          messages.errors.length = 1;
        }
        return reject(new Error(messages.errors.join('\n\n')));
      }
      if (
        process.env.CI &&
        (typeof process.env.CI !== 'string' || process.env.CI.toLowerCase() !== 'false') &&
        messages.warnings.length
      ) {
        console.log(
          chalk.yellow(
            '\nTreating warnings as errors because process.env.CI = true.\n' +
              'Most CI servers set it automatically.\n',
          ),
        );
        return reject(new Error(messages.warnings.join('\n\n')));
      }
      return resolve({
        stats,
        previousFileSizes,
        warnings: messages.warnings,
      });
    });
  });
}
