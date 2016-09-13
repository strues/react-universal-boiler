import http from 'http';
import express from 'express';
import compression from 'compression';

import hotReload from '../webpack/util/hotReload';

const cfg = require('../config/defaults');

const app = express();
const server = http.createServer(app);

if (process.env.NODE_ENV === 'development') {
  hotReload(app)
} else {
  app.use(express.static(path.join(process.cwd(), 'static')));
}


server.listen(cfg.SSR_PORT, (err) => {
  if (err) {
    console.log(err);
    return;
  }
  console.log(`Web server listening on ${cfg.HOST}:${cfg.SSR_PORT}`);
});