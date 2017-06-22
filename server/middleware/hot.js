const webpack = require('webpack');
const webpackDevMiddleware = require('webpack-dev-middleware-multi-compiler');
const webpackHotMiddleware = require('webpack-hot-middleware');
const webpackHotServerMiddleware = require('webpack-hot-server-middleware');
const FriendlyErrorsWebpackPlugin = require('friendly-errors-webpack-plugin');
const buildWebpackDlls = require('../../tools/utils/buildWebpackDlls');
const createServerConfig = require('../../tools/webpack/createServerConfig');
const createClientConfig = require('../../tools/webpack/createClientConfig');

async function setupHotDev(app) {
  await buildWebpackDlls();
  const clientConfig = createClientConfig();
  const serverConfig = createServerConfig();
  const publicPath = clientConfig.output.publicPath;
  const outputPath = clientConfig.output.path;

  const multiCompiler = webpack([clientConfig, serverConfig]);
  const clientCompiler = multiCompiler.compilers[0];

  app.use(webpackDevMiddleware(multiCompiler, { publicPath }));
  app.use(webpackHotMiddleware(clientCompiler));
  app.use(
    webpackHotServerMiddleware(multiCompiler, {
      serverRendererOptions: { outputPath },
    }),
  );
}
module.exports = setupHotDev;
