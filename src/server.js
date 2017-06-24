import React from 'react';
import { renderToString } from 'react-dom/server';
import { Provider } from 'react-redux';
import serialize from 'serialize-javascript';
import { compose } from 'redux';
import createHistory from 'history/createMemoryHistory';
import StaticRouter from 'react-router-dom/StaticRouter';
import uuid from 'uuid/v4';
import matchPath from 'react-router-dom/matchPath';
import { ServerStyleSheet } from 'styled-components';
import Helmet from 'react-helmet';
import { flushModuleIds } from 'react-universal-component/server';
import flushChunks from 'webpack-flush-chunks';

import configureStore from './state/store';
import routes from './routes';
import App from './components/App';

const isDev = process.env.NODE_ENV === 'development';
const isProd = process.env.NODE_ENV === 'production';

/**
 * Express middleware to render HTML
 * @param  {object}     stats Webpack stats output
 * @return {function}   middleware function
 */
export default ({ clientStats, outputPath }) => {
  /**
     * @param  {object}     req Express request object
     * @param  {object}     res Express response object
     * @return {undefined}  undefined
     */
  return async (req, res, next) => {
    const { nonce } = res.locals;
    global.navigator = { userAgent: req.headers['user-agent'] };

    const history = createHistory();
    const createStore = req => configureStore({});
    const store = createStore(history);
    //
    const sheet = new ServerStyleSheet();
    const routerContext = {};
    // Here is where our data loading begins
    let status = 200;

    const matches = routes.reduce((matches, route) => {
      const match = matchPath(req.url, route.path, route);
      if (match && match.isExact) {
        matches.push({
          route,
          match,
          promise: route.component.fetchData
            ? route.component.fetchData({ store, params: match.params })
            : Promise.resolve(null),
        });
      }
      return matches;
    }, []);

    // No such route, send 404 status
    if (matches.length === 0) {
      status = 404;
    }

    // Any AJAX calls inside components
    const promises = await matches.map(match => {
      return match.promise;
    });

    // Resolve the AJAX calls and render
    Promise.all(promises).then((...data) => {
      const appComponent = (
        <Provider store={store}>
          <StaticRouter location={req.url} context={routerContext}>
            <App />
          </StaticRouter>
        </Provider>
      );
      const markup = renderToString(sheet.collectStyles(appComponent));

      const helmet = Helmet.renderStatic();
      const moduleIds = flushModuleIds();
      const { js, styles, publicPath } = flushChunks(clientStats, {
        moduleIds,
        before: ['bootstrap'],
        after: ['main'],
        outputPath,
      });

      const preloadedState = store.getState();

      const styleTags = sheet.getStyleTags();
      if (routerContext.url) {
        res.status(301).setHeader('Location', routerContext.url);
        res.redirect(routerContext.url);
        return;
      }
      store.dispatch({
        type: 'RESET',
      });
      // Two different HTML templates here so that we can server DLLs during development
      // @TODO: figure out how to conditionally add dlls without duplicating the code
      if (isDev) {
        res.status(status).send(`
        <!doctype html>
          <html ${helmet.htmlAttributes.toString()}>
            <head>
              ${helmet.title.toString()}
              ${helmet.meta.toString()}
              ${helmet.link.toString()}
              ${styleTags}
              ${styles}
            </head>
            <body ${helmet.bodyAttributes.toString()}>
              <div id="app">${markup}</div>
              <script nonce=${nonce} type="text/javascript" src="/__vendor_dlls__.js"></script>
              ${js}
              <script type="text/javascript" nonce=${nonce}>
                window.__PRELOADED_STATE__=${serialize(preloadedState, { json: true })}
              </script>
            </body>
          </html>`);
      } else {
        res.status(status).send(`
        <!doctype html>
          <html>
            <head>
              ${helmet.title.toString()}
              ${helmet.meta.toString()}
              ${helmet.link.toString()}
              ${styleTags}
              ${styles}
            </head>
            <body>
              <div id="app">${markup}</div>
              ${js}
              <script type="text/javascript" nonce=${nonce}>
                window.__PRELOADED_STATE__=${serialize(preloadedState, { json: true })}
              </script>
            </body>
          </html>`);
      }
    });
  };
};
