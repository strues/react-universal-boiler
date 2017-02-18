import http from 'http';
import path from 'path';
// Express deps
import Express from 'express';
import compression from 'compression';
import favicon from 'serve-favicon';
// React deps
import ssrMiddleware from './middleware/ssr';

const debug = require('debug')('boldr:server');

const port = parseInt(process.env.SSR_PORT, 10);

const app = new Express();
const server = http.createServer(app);
app.use(compression());
app.use(favicon(path.resolve(process.cwd(), './static/favicon.ico')));
app.use(Express.static(path.join(__dirname, '..', 'static')));

app.get('*', ssrMiddleware);

server.listen(port, (err) => {
  if (err) {
    debug(err);
    return;
  }
  console.log(`🚀  Web server listening on ${port} in ${process.env.NODE_ENV} mode`);
});
