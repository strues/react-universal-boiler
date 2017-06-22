const logger = require('boldr-utils/lib/logger');
const printAssets = require('../utils/printAssets');
const createServerConfig = require('../webpack/createServerConfig');
const createClientConfig = require('../webpack/createClientConfig');
const webpackCompiler = require('../utils/webpackCompiler');
const config = require('../config');

logger.start('Starting production build...');

let serverCompiler;

const clientConfig = createClientConfig();
const serverConfig = createServerConfig();

// Compiles server code using the prod.server config
const buildServer = () => {
  serverCompiler = webpackCompiler(serverConfig, stats => {
    if (stats.hasErrors()) {
      logger.info(stats.hasErrors());
      process.exit(1);
    }
    logger.end('Built server.');
  });
  serverCompiler.run(() => undefined);
};

const clientCompiler = webpackCompiler(clientConfig, stats => {
  if (stats.hasErrors()) {
    logger.info(stats);
    process.exit(1);
  }
  logger.info('Assets:');
  printAssets(stats, clientConfig);
  buildServer();
});
clientCompiler.run(() => undefined);
