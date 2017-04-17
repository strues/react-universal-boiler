import React from 'react';
import { renderToString, renderToStaticMarkup } from 'react-dom/server';
import { Provider } from 'react-redux';
import createHistory from 'history/createMemoryHistory';
import StaticRouter from 'react-router-dom/StaticRouter';
import matchRoutes from 'react-router-config/matchRoutes';
import styleSheet from 'styled-components/lib/models/StyleSheet';
import Helmet from 'react-helmet';

import configureStore from '../../../shared/state/store';
import renderRoutes from '../../../shared/core/addRoutes';
import routes from '../../../shared/routes';
import CreateHtml from './CreateHtml';

function renderAppToString(store, routerContext, req) {
  return renderToString(
    <Provider store={store}>
      <StaticRouter location={req.url} context={routerContext}>
        {renderRoutes(routes)}
      </StaticRouter>
    </Provider>,
  );
}

function ssrMiddleware(req, res, next) {
  const { nonce } = res.locals;
  global.navigator = { userAgent: req.headers['user-agent'] };

  const history = createHistory();
  const store = configureStore(history);

  // Create context for React Router
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
  loadBranchData()
    .then(() => {
      // Checking if the response status is 404.
      const status = routerContext.status === '404' ? 404 : 200;
      // Render our application to a string for the first time
      const reactAppString = renderAppToString(store, routerContext, req);

      const helmet = Helmet.rewind();
      // render styled-components styleSheets to string.
      const styles = styleSheet.rules().map(rule => rule.cssText).join('\n');
      // Render the application to static HTML markup
      const html = renderToStaticMarkup(
        <CreateHtml
          reactAppString={reactAppString}
          nonce={nonce}
          helmet={Helmet.rewind()}
          styles={styles}
          preloadedState={store.getState()}
        />,
      );
      // Check if the render result contains a redirect, if so we need to set
      // the specific status and redirect header and end the response
      if (routerContext.url) {
        res.status(301).setHeader('Location', routerContext.url);
        res.end();

        return;
      }

      // Pass the route and initial state into html template
      return res.status(status).send(`<!DOCTYPE html>${html}`);
    })
    .catch(err => {
      console.error(`💩  ==> Rendering route resulted in an error: ${err}`);
      return res.status(404).send('Oh No! Your request got lost.');
    });
}
export default ssrMiddleware;
