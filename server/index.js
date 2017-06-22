const path = require('path');
const http = require('http');
const express = require('express');
const compression = require('compression');
const uuid = require('uuid');

const app = express();
const server = http.createServer(app);
const host = process.env.SERVER_HOST || 'localhost';
const processPort = process.env.PORT;

// If the port is set using an env variable, convert it to an int
// fallback to 3000.
const port = processPort ? parseInt(processPort, 10) : 3000;

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

app.use(express.static(path.resolve(process.cwd(), './build/assets')));
// Setup the public directory so that we can serve static assets.
app.use(express.static(path.resolve(process.cwd(), './public')));
// Pass any get request through the SSR middleware before sending it back
// app.get('*', ssrMiddleware);
if (process.env.NODE_ENV === 'development') {
  const setupHotDev = require('./middleware/hot');
  setupHotDev(app);
} else {
  const clientStats = require('../build/assets/stats.json');
  const serverRender = require('../build/server.js').default;

  // server.use(publicPath, express.static(outputPath))
  app.use(serverRender({ clientStats }));
}
const listener = server.listen(port, () => {
  console.log(`🚀  Server running on port: ${port}`);
});

module.exports = app;
