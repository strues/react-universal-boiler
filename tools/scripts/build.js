import logger from 'boldr-utils/es/logger';

import printAssets from '../utils/printAssets';
import compileConfigs from '../utils/compileConfigs';
import webpackCompiler from '../utils/webpackCompiler';
import paths from '../config/paths';
import config from '../config/config';

logger.start('Starting production build...');

let serverCompiler;

const { clientConfig, serverConfig } = compileConfigs(config, 'production');

// Compiles server code using the prod.server config
const buildServer = () => {
  serverCompiler = webpackCompiler(serverConfig, stats => {
    if (stats.hasErrors()) {
      process.exit(1);
    }
    logger.end('Built server.');
  });
  serverCompiler.run(() => undefined);
};

const clientCompiler = webpackCompiler(clientConfig, stats => {
  if (stats.hasErrors()) {
    process.exit(1);
  }
  logger.info('Assets:');
  printAssets(stats, clientConfig);
  buildServer();
});
clientCompiler.run(() => undefined);
