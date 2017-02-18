import React from 'react';
import ReactDOM from 'react-dom/server';
import { Provider } from 'react-redux';

import Html from '../../../shared/components/Html';
import App from '../../../shared/components/App';
import Root from '../../../shared/components/Root';
import configureStore from '../../../shared/state/store';
import createHtml from './createHtml';
import fetchData from './fetchData';


export default function ssrMiddleware(req, res, next) {
  if (__DEV__) {
    webpackIsomorphicTools.refresh();
  }
  const preloadedState = {};
  const store = configureStore(preloadedState);
  const context = {};
  const container = (
    <Provider store={store}>
      <Root
        server={{ context, location: req.url }}
        store={store}
      >
        <App />
      </Root>
    </Provider>
  );

  fetchData(container, store)
    .then(({ RootComponent, store }) => {
      const markup = createHtml(RootComponent, store.getState());
      if (context.url) {
        res.status(301).set({
          Location: context.url
        }).end();
      } else {
        res.send(markup);
      }
    })
    .catch(err => {
      console.log(err);
      res.send(err);
    });
}
