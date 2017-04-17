import path from 'path';
import http from 'http';
import Express from 'express';
import compression from 'compression';
import uuid from 'uuid';
import ssrMiddleware from './middleware/ssr';

const app = new Express();
const server = http.createServer(app);
const host = process.env.SERVER_HOST || 'localhost';
const processPort = process.env.SERVER_PORT;

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

// Setup the public directory so that we can serve static assets.
app.use(Express.static(path.join(process.cwd(), 'public')));
// Pass any get request through the SSR middleware before sending it back
app.get('*', ssrMiddleware);

server.listen(port, () => {
  console.log(`🚀  Server running on port: ${port}`);
});
