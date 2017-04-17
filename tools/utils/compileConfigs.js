import path from 'path';
import cloneDeep from 'lodash/cloneDeep';
import merge from 'webpack-merge';
import webpack from 'webpack';
import logger from 'boldr-utils/es/logger';

import baseConfig from '../webpack/webpack.base.config';
import clientDevConfig from '../webpack/webpack.client.dev.config';
import serverDevConfig from '../webpack/webpack.server.dev.config';
import clientProdConfig from '../webpack/webpack.client.prod.config';
import serverProdConfig from '../webpack/webpack.server.prod.config';
import paths from '../config/paths';

module.exports = (config, environment = 'development') => {
  const {
    serverPort,
    serverHost,
    hmrPort,
    isDebug,
    isVerbose,
    serveAssetsFrom,
  } = config;

  let clientConfig = clientDevConfig;
  let serverConfig = serverDevConfig;

  let clientOptions = {
    type: 'client',
    serverPort,
    serverHost,
    hmrPort,
    serveAssetsFrom,
    environment,
    isVerbose,
    isDebug,
    publicPath: `http://${serverHost}:${hmrPort}/assets/`,
    publicDir: paths.publicDir,
    clientAssetsFile: 'assets.json',
  };

  if (environment === 'production') {
    clientConfig = clientProdConfig;
    serverConfig = serverProdConfig;

    clientOptions = merge(clientOptions, {
      publicPath: clientOptions.serveAssetsFrom,
      publicDir: paths.publicDir,
    });
  }
  const serverOptions = merge(clientOptions, {
    type: 'server',
  });

  // Merge options with static webpack configs
  clientConfig = merge.smart(
    baseConfig(clientOptions),
    clientConfig(clientOptions),
  );
  serverConfig = merge.smart(
    baseConfig(serverOptions),
    serverConfig(serverOptions),
  );

  // A "main" entry is required in the server config.
  if (!serverConfig.entry.main) {
    logger.error(
      'A main entry is required in the server configuration. Found: ',
      serverConfig.entry,
    );
    process.exit(1);
  }

  return {
    clientConfig,
    serverConfig,
  };
};
