import React from 'react';
import { renderToString, renderToStaticMarkup } from 'react-dom/server';
import { Provider } from 'react-redux';
import { compose } from 'redux';
import createHistory from 'history/createMemoryHistory';
import StaticRouter from 'react-router-dom/StaticRouter';
import matchRoutes from 'react-router-config/matchRoutes';
import { ServerStyleSheet } from 'styled-components';
import { flushWebpackRequireWeakIds } from 'react-loadable';
import Helmet from 'react-helmet';

import configureStore from './state/store';
import routes from './routes';
import renderRoutes from './util/addRoutes';
import CreateHtml from './util/CreateHtml';

function render(req, routerContext, store, sheet, nonce, stats) {
  const appComponent = (
    <Provider store={store}>
      <StaticRouter location={req.url} context={routerContext}>
        {renderRoutes(routes)}
      </StaticRouter>
    </Provider>
  );
  const markup = renderToString(sheet.collectStyles(appComponent));

  const head = Helmet.renderStatic();

  const initialState = store.getState();

  return renderToStaticMarkup(
    <CreateHtml
      reactAppString={markup}
      helmet={Helmet.renderStatic()}
      nonce={nonce}
      preloadedState={store.getState()}
      initialState={initialState}
    />,
  );
}

/**
 * Express middleware to render HTML using react-router
 * @param  {object}     stats Webpack stats output
 * @return {function}   middleware function
 */
export default ({ clientStats }) => {
  // Build stats maps for quicker lookups.
  const modulesById = clientStats.modules.reduce((modules, mod) => {
    modules[mod.id] = mod;
    return modules;
  }, {});
  const chunksById = clientStats.chunks.reduce((chunks, chunk) => {
    chunks[chunk.id] = chunk;
    return chunks;
  }, {});
  const assetsByChunkName = clientStats.assetsByChunkName;

  /**
     * @param  {object}     req Express request object
     * @param  {object}     res Express response object
     * @return {undefined}  undefined
     */
  return (req, res, next) => {
    const { nonce } = res.locals;
    global.navigator = { userAgent: req.headers['user-agent'] };

    const history = createHistory();
    const createStore = req => configureStore({});
    const store = createStore(history);
    const sheet = new ServerStyleSheet();
    const routerContext = {};
    // Here is where our data loading begins
    const loadBranchData = async () => {
      // Matching our routes to the url
      const branch = await matchRoutes(routes, req.url);
      // Create promises for our components that require data
      const promises = branch.map(({ route, match }) => {
        // Dispatch the action(s) through the loadData method of "./routes.js"
        if (route.loadData) {
          // If the route has loadData, execute the function with
          // the matched parameters
          return route.loadData(store.dispatch, match.params);
        }

        return Promise.resolve(null);
      });

      return Promise.all(promises);
    };
    // Send response after all the action(s) are dispatched.
    loadBranchData().then(() => {
      let html;
      try {
        html = render(req, routerContext, store, sheet, nonce, {
          modulesById,
          chunksById,
          assetsByChunkName,
        });
      } catch (ex) {
        return next(ex);
      }
      if (routerContext.url) {
        res.status(301).setHeader('Location', routerContext.url);
        res.end();

        return;
      }
      // Check if the render result contains a redirect, if so we need to set
      // the specific status and redirect header and end the response

      // Checking if the response status is 404.
      // const status = routerContext.status === '404' ? 404 : 200;

      // Pass the route and initial state into html template
      res.status(routerContext.missed ? 404 : 200).send(`<!doctype html>${html}`);
    });
  };
};
