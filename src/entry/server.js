import React from 'react';
import { renderToString, renderToNodeStream } from 'react-dom/server';
import { Provider } from 'react-redux';
import createHistory from 'history/createMemoryHistory';
import StaticRouter from 'react-router-dom/StaticRouter';
import matchPath from 'react-router-dom/matchPath';
import { ServerStyleSheet } from 'styled-components';
import { flushChunkNames } from 'react-universal-component/server';
import flushChunks from 'webpack-flush-chunks';

import configureStore from '../state/store';
import routes from '../routes';
import App from '../components/App';
import Html from '../components/Html';

/**
 * Express middleware to render HTML
 * @param  {object}     stats Webpack stats output
 * @return {function}   middleware function
 */
export default ({ clientStats }) => (req, res, next) => {
  global.navigator = { userAgent: req.headers['user-agent'] };

  const history = createHistory({ initialEntries: [req.path] });
  const initialState = {};
  const store = configureStore(initialState, history);
  //
  const sheet = new ServerStyleSheet();
  const routerContext = {};

  const appComponent = (
    <Provider store={store}>
      <StaticRouter location={req.url} context={routerContext}>
        <App />
      </StaticRouter>
    </Provider>
  );

  // Here is where our data loading begins
  const matches = routes.reduce((matches, route) => {
    const match = matchPath(req.url, route.path, route);
    if (match && match.isExact) {
      const fetchData = route.component.fetchData || route.fetchData;
      matches.push({
        route,
        match,
        promise: fetchData ? fetchData({ store, params: match.params }) : Promise.resolve(),
      });
    }
    return matches;
  }, []);

  // No such route, send 404 status
  if (matches.length === 0) {
    routerContext.status = 404;
  }

  // Any AJAX calls inside components
  const promises = matches.map(match => {
    return match.promise;
  });

  // Resolve the AJAX calls and render
  Promise.all(promises).then(async () => {
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
    console.log('Rendered the following chunks:', chunkNames.join(', '));
    const { scripts, stylesheets, cssHashRaw } = flushChunks(clientStats, { chunkNames });

    // get the stylesheet elements from what styled-components created during
    // render to string
    const styleTags = sheet.getStyleElement();

    console.log('Rendering page to stream...');
    const preloadedState = store.getState();
    const html = renderToNodeStream(
      <Html
        styles={stylesheets}
        cssHash={cssHashRaw}
        js={scripts}
        styleTags={styleTags}
        nonce={res.locals.nonce}
        component={markup}
        state={preloadedState}
      />,
    );

    console.log('Sending Page...');
    switch (routerContext.status) {
      case 301:
      case 302:
        res.status(routerContext.status);
        res.location(routerContext.url);
        res.end();
        break;
      case 404:
        res.status(routerContext.status);
        res.type('html');
        res.write('<!doctype html>');
        html.pipe(res);
        break;
      default:
        res.status(200);
        res.type('html');
        res.setHeader('Cache-Control', 'no-cache');
        res.write('<!doctype html>');
        html.pipe(res);
    }
  });
};
