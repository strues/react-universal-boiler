const path = require('path');
const http = require('http');
const express = require('express');
const compression = require('compression');
const uuid = require('uuid');
const dotenv = require('dotenv');

dotenv.config();
const app = express();
const server = http.createServer(app);

const processPort = process.env.PORT;

// If the port is set using an env variable, convert it to an int
// fallback to 3000.
const port = parseInt(processPort, 10) || 3000;

// Remove annoying Express header addition.
app.disable('x-powered-by');

// Compress (gzip) assets in production.
app.use(compression());
// Create a nonce and attach it to the request. This allows us to safely
// use CSP to inline scripts.
app.use((req, res, next) => {
  res.locals.nonce = uuid.v4(); // eslint-disable-line no-param-reassign
  next();
});

// Without adding a "path" Express will serve files = require(the direcotry
// as if they're coming form the root of the site.
//      For example: app.use('/assets', express.static(....))
//        -- will serve the files in the directory = require(websiteUrl/assets/
const assetDir = process.env.CLIENT_OUTPUT;
app.use(process.env.PUBLIC_PATH, express.static(path.resolve(process.cwd(), assetDir)));
// Setup the public directory so that we can serve static assets.
app.use(express.static(path.resolve(process.cwd(), './public')));
// Pass any get request through the SSR middleware before sending it back
// app.get('*', ssrMiddleware);
if (process.env.NODE_ENV === 'development') {
  require('babel-register')();
  const setupHotDev = require('./middleware/hot');
  setupHotDev(app);
} else {
  const clientStats = require('../build/assets/stats.json');
  const serverRender = require('../build/server.js').default;

  // server.use(publicPath, express.static(outputPath))
  app.use(serverRender({ clientStats }));
}

server.listen(port, () => {
  console.log(`🚀  Server running on port: ${port}`);
});

process.on('unhandledRejection', e => {
  console.error(e);
});

module.exports = app;
