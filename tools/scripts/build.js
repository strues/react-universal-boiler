import createWebpackConfig from '../webpack/createWebpackConfig';
import webpackCompiler from '../utils/webpackCompiler';

console.log('Starting production build...');

let serverCompiler;

const clientConfig = createWebpackConfig({
  target: 'client',
  env: 'production',
});

const serverConfig = createWebpackConfig({
  target: 'server',
  env: 'production',
});

// Compiles server code using the prod.server config
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

const clientCompiler = webpackCompiler(clientConfig, stats => {
  if (stats.hasErrors()) {
    console.info(stats);
    process.exit(1);
  }
  buildServer();
});
clientCompiler.run(() => undefined);
