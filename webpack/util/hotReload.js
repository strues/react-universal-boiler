import path from 'path';
import chokidar from 'chokidar';
import webpack from 'webpack';
import webpackConfig from '../webpack.client.babel';
import paths from '../../config/paths';

const debug = require('debug')('hot');

export default function hotReload(app) {
  const compiler = webpack(webpackConfig);

  compiler.plugin('compile', () => debug('Webpack compile started...'));
  compiler.plugin('compilation', () => debug('Webpack compiling...'));

  app.use(require('webpack-dev-middleware')(compiler, {
      quiet: true,
      noInfo: true,
      stats: {
        colors: true,
        reasons: true,
      },
      publicPath: webpackConfig.output.publicPath,
    }));

    app.use(require('webpack-hot-middleware')(compiler));

    const watcher = chokidar.watch(path.resolve(paths.src, 'server.js'));
    debug('Watching server source')
    watcher.on('ready', () => {
      watcher.on('all', () => {
        debug('Clearing /server/ module cache from server')
        Object.keys(require.cache).forEach((id) => {
          if (/\/server\//.test(id)) delete require.cache[id]
        })
      })
    })

    debug('Watching client app source')
    compiler.plugin('done', () => {
      debug('Clearing /app/ module cache from server')
      Object.keys(require.cache).forEach((id) => {
        if (/\/app\//.test(id)) delete require.cache[id]
        if (/\/server\//.test(id)) delete require.cache[id]
      })
    })
}