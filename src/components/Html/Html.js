import React from 'react';
import Helmet from 'react-helmet';
import serialize from 'serialize-javascript';

const Html = props => {
  const { styles, cssHash, js, component, state, styleTags, nonce } = props;
  const head = Helmet.renderStatic();
  const htmlAttrs = head.htmlAttributes.toComponent();

  const isDev = process.env.NODE_ENV === 'development';
  return (
    <html lang="en" {...htmlAttrs}>
      <head>
        {head.title.toComponent()}
        {head.meta.toComponent()}
        {head.link.toComponent()}
        <link
          rel="stylesheet"
          href="//cdnjs.cloudflare.com/ajax/libs/normalize/7.0.0/normalize.min.css"
          crossOrigin="anonymous"
        />
        <link
          rel="stylesheet"
          href="//cdn.rawgit.com/milligram/milligram/master/dist/milligram.min.css"
          crossOrigin="anonymous"
        />
        {styleTags}
        {styles.map(name => (
          <link rel="stylesheet" href={`${process.env.PUBLIC_PATH}${name}`} key={name} />
        ))}
        <link
          href="https://fonts.googleapis.com/css?family=Rubik:300,400,700|Roboto:300,400"
          rel="stylesheet"
        />
      </head>
      <body>
        <div id="app" nonce={nonce} dangerouslySetInnerHTML={{ __html: component }} />
        <script
          type="text/javascript"
          nonce={nonce}
          dangerouslySetInnerHTML={{
            __html: `window.__PRELOADED_STATE__=${serialize(state, { json: true })};`,
          }}
          charSet="UTF-8"
        />
        <script
          type="text/javascript"
          nonce={nonce}
          dangerouslySetInnerHTML={{
            __html: `window.__CSS_CHUNKS__=${serialize(cssHash)};`,
          }}
          charSet="UTF-8"
        />

        {isDev ? (
          <script type="text/javascript" nonce={nonce} charSet="UTF-8" src="/assets/vendor.js" />
        ) : (
          <span />
        )}
        {js.map(name => (
          <script
            type="text/javascript"
            nonce={nonce}
            src={`${process.env.PUBLIC_PATH}${name}`}
            key={name}
            charSet="UTF-8"
          />
        ))}
      </body>
    </html>
  );
};

export default Html;
