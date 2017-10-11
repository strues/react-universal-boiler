import webpack from 'webpack';
import webpackDevMiddleware from 'webpack-dev-middleware';
import webpackHotMiddleware from 'webpack-hot-middleware';
import webpackHotServerMiddleware from 'webpack-hot-server-middleware';
import formatWebpackMessages from 'react-dev-utils/formatWebpackMessages';
import createWebpackConfig from '../../tools/webpack/createWebpackConfig';

function setupHotDev(app) {
  const clientConfig = createWebpackConfig({
    target: 'client',
    env: 'development',
  });

  const serverConfig = createWebpackConfig({
    target: 'server',
    env: 'development',
  });
  const publicPath = clientConfig.output.publicPath;
  const outputPath = clientConfig.output.path;

  const multiCompiler = webpack([clientConfig, serverConfig]);
  const clientCompiler = multiCompiler.compilers[0];

  app.use(
    webpackDevMiddleware(multiCompiler, {
      // required
      publicPath,
      // display no info to console (only warnings and errors)
      noInfo: true,
      quiet: true,
      // prevent loading before bundle is done
      serverSideRender: true,
    }),
  );

  app.use(webpackHotMiddleware(clientCompiler));

  app.use(
    webpackHotServerMiddleware(multiCompiler, {
      chunkName: 'server',
      serverRendererOptions: { outputPath },
    }),
  );

  multiCompiler.plugin('invalid', () => {
    console.log('Compiling...');
  });
  multiCompiler.plugin('done', stats => {
    const rawMessages = stats.toJson({}, true);
    const messages = formatWebpackMessages(rawMessages);

    if (!messages.errors.length && !messages.warnings.length) {
      console.log('Compiled successfully!');
    }

    // If errors exist, only show errors.
    if (messages.errors.length) {
      console.error('Failed to compile.\n');
      messages.errors.forEach(e => console.error(e));
      return;
    }

    // Show warnings if no errors were found.
    if (messages.warnings.length) {
      console.warn('Compiled with warnings.\n');
      messages.warnings.forEach(w => console.warn(w));
    }
  });
}
module.exports = setupHotDev;
