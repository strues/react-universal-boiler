import React from 'react';
import { renderToString } from 'react-dom/server';
import { Provider } from 'react-redux';
import createHistory from 'history/createMemoryHistory';
import StaticRouter from 'react-router-dom/StaticRouter';
import matchPath from 'react-router-dom/matchPath';
import { ServerStyleSheet } from 'styled-components';
import { flushChunkNames } from 'react-universal-component/server';
import flushChunks from 'webpack-flush-chunks';

import configureStore from '../shared/state/store';
import routes from '../shared/routes';
import App from '../shared/components/App';
import renderHtml from './renderHtml';

/**
 * Express middleware to render HTML
 * @param  {object}     stats Webpack stats output
 * @return {function}   middleware function
 */
export default ({ clientStats }) => {
  return async (req, res, next) => {
    global.navigator = { userAgent: req.headers['user-agent'] };

    const history = createHistory({ initialEntries: [req.path] });
    const initialState = {};
    const store = configureStore(initialState, history);
    //
    const sheet = new ServerStyleSheet();
    const routerContext = {};
    // Here is where our data loading begins
    let status = 200;

    const matches = routes.reduce((matches, route) => {
      const match = matchPath(req.url, route.path, route);
      if (match && match.isExact) {
        const fetchData = route.component.fetchData || route.fetchData;
        matches.push({
          route,
          match,
          promise: fetchData
            ? fetchData({ store, params: match.params })
            : Promise.resolve(),
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
    Promise.all(promises).then(async () => {
      const appComponent = (
        <Provider store={store}>
          <StaticRouter location={req.url} context={routerContext}>
            <App />
          </StaticRouter>
        </Provider>
      );

      let markup = '';
      try {
        // render the applicaation to a string and let styled-components
        // create stylesheet tags
        markup = await renderToString(sheet.collectStyles(appComponent));
      } catch (err) {
        console.error('Unable to render server side React:', err);
      }

      console.log('Flushing chunks...');
      const chunkNames = flushChunkNames();
      console.log('Rendered the following cnunks:', chunkNames.join(', '));
      const { js, styles, cssHash } = flushChunks(clientStats, { chunkNames });
      console.log(`Flushed JS tags:\n${js.toString()}\n`);
      console.log(`Flushed CSS Tags:\n${styles.toString()}\n`);
      // get the stylesheet tags from what styled-components created during
      // render to string
      const styleTags = sheet.getStyleTags();
      if (routerContext.url) {
        res.status(301).setHeader('Location', routerContext.url);
        res.redirect(routerContext.url);
        return;
      }

      console.log('Rendering Page...');
      const preloadedState = store.getState();
      // creates the HTML we send back down to the browser.
      const pageHtml = renderHtml({
        preloadedState,
        markup,
        styleTags,
        styles: styles.toString(),
        scripts: cssHash + js.toString(),
      });
      // Dont cache dynamic content.
      res.setHeader('Cache-Control', 'no-cache');

      console.log('Sending Page...');
      res.status(status).send(pageHtml);
    });
  };
};
