import { renderToString } from 'react-dom/server';

const createHtml = (Component, finalState) => {
  const html = renderToString(Component);
  const doctype = '<!doctype html>';
  const assets = webpackIsomorphicTools.assets(); // eslint-disable-line
  const HTML = `
    <html>
      <head>
        <title>Universal React Boiler</title>
        <meta name="viewport" content="width=device-width, initial-scale=1, user-scalable=no">
        <link href="https://fonts.googleapis.com/css?family=Montserrat|Source+Sans+Pro" rel="stylesheet">
        <link href="https://maxcdn.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css" rel="stylesheet">
        ${Object.keys(assets.styles).map((style, key) =>
          `<link href='${assets.styles[style]}'media="screen, projection" rel="stylesheet" type="text/css" charSet="UTF-8"/>` // eslint-disable-line
        )}
      </head>
      <body style="height: 100%;">
        <div id='content'>${html}</div>
        <script>
          window.__PRELOADED_STATE__ = ${JSON.stringify(finalState).replace(/</g, '\\x3c')}
        </script>
      

         <script src="${assets.javascript.main}" charSet="UTF-8"></script>
      </body>
    </html>`;
  return doctype + HTML;
};

export default createHtml;
