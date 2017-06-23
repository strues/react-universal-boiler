import React from 'react';
import { renderToString, renderToStaticMarkup } from 'react-dom/server';
import { Provider } from 'react-redux';
import serialize from 'serialize-javascript';
import { compose } from 'redux';
import createHistory from 'history/createMemoryHistory';
import StaticRouter from 'react-router-dom/StaticRouter';
import matchPath from 'react-router-dom/matchPath';
import { ServerStyleSheet } from 'styled-components';
import Helmet from 'react-helmet';
import { flushChunkNames } from 'react-universal-component/server';
import flushChunks from 'webpack-flush-chunks';

import configureStore from './state/store';
import routes from './routes';
import App from './components/App';

const isDev = process.env.NODE_ENV === 'development';
const isProd = process.env.NODE_ENV === 'production';

/**
 * Express middleware to render HTML using react-router
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

      const chunkNames = flushChunkNames();
      const {
        // react components:
        Js,
        // external stylesheets
        Styles,
        // raw css
        Css,

        // strings:
        js,
        // external stylesheets
        styles,
        // raw css
        css,

        // arrays of file names (not including publicPath):
        scripts,
        stylesheets,

        publicPath,
      } = flushChunks(clientStats, {
        chunkNames,
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
      if (process.env.NODE_ENV === 'development') {
        res.status(status).send(
          `<!doctype html>
        <html ${helmet.htmlAttributes.toString()}>
          <head>
            ${helmet.title.toString()}
            ${helmet.meta.toString()}
            ${helmet.link.toString()}
            ${styles}
            ${styleTags}
          </head>
          <body>
            <div id="app">${markup}</div>

          <script nonce=${nonce} type="text/javascript" src="/__vendor_dlls__.js?t=${Date.now()}"></script>
          ${js}
          <script nonce=${nonce} type="text/javascript">window.__PRELOADED_STATE__=${serialize(
            preloadedState,
            { json: true },
          )}</script>
        </body>
        </html>`,
        );
      } else {
        res.status(status).send(
          `<!doctype html>
        <html ${helmet.htmlAttributes.toString()}>
          <head>
            ${helmet.title.toString()}
            ${helmet.meta.toString()}
            ${helmet.link.toString()}
            ${styles}
            ${styleTags}
          </head>
          <body>
            <div id="app">${markup}</div>
          ${js}
          <script nonce=${nonce} type="text/javascript">window.__PRELOADED_STATE__=${serialize(
            preloadedState,
            { json: true },
          )}</script>
        </body>
        </html>`,
        );
      }
    });
  };
};
