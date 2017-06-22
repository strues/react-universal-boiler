/* eslint-disable react/no-danger, react/no-array-index-key, react/jsx-key */
import React, { Children } from 'react';
import serialize from 'serialize-javascript';
import { string, object, node, element } from 'prop-types';
import { ifElse, removeNil } from 'boldr-utils';
import Html from '../components/Html';

// This is output by Webpack after the bundle is compiled. It contains
// information about the files Webpack bundled. ASSETS_MANIFEST is
// inlined as a path when processed by Webpack.
const clientAssets = require(ASSETS_MANIFEST);

function KeyedComponent({ children }) {
  return Children.only(children);
}

const isDev = process.env.NODE_ENV === 'development';
const isProd = process.env.NODE_ENV === 'production';

/**
 * Takes a stylesheet file path and creates an html
 * style element
 * @param  {string} stylesheetFilePath path of the file
 * @return {element}                    dom element
 */
function createStyleElement(stylesheetFilePath) {
  return (
    <link href={stylesheetFilePath} media="screen, projection" rel="stylesheet" type="text/css" />
  );
}

/**
 * Takes a javascript file path and creates an html
 * script element
 * @param  {string} jsFilePath          path of the file
 * @return {element}                    dom element
 */
function createScriptElement(jsFilePath) {
  return <script type="text/javascript" src={jsFilePath} />;
}

export default function CreateHtml(props) {
  const { reactAppString, nonce, preloadedState, styledCss, helmet } = props;

  // Creates an inline script definition that is protected by the nonce.
  const inlineScript = body =>
    <script nonce={nonce} type="text/javascript" dangerouslySetInnerHTML={{ __html: body }} />; // eslint-disable-line

  const headerElements = removeNil([
    // if React Helmet component, render the helmet data
    // else act as an empty array.
    ...ifElse(helmet)(() => helmet.title.toComponent(), []),
    ...ifElse(helmet)(() => helmet.base.toComponent(), []),
    ...ifElse(helmet)(() => helmet.meta.toComponent(), []),
    ...ifElse(helmet)(() => helmet.link.toComponent(), []),
    // This is somewhat wonky, but basically:
    // if env === production && we have clientAssets && clientAssets has
    // vendor css, create a style element with it.
    ifElse(isProd && clientAssets && clientAssets.vendor.css)(() =>
      createStyleElement(clientAssets.vendor.css),
    ),
    ifElse(isProd && clientAssets && clientAssets.main.css)(() =>
      createStyleElement(clientAssets.main.css),
    ),
    ...ifElse(helmet)(() => helmet.style.toComponent(), []),
  ]);

  const bodyElements = removeNil([
    // Places the Redux store data on the window available at
    // window.__PRELOADED_STATE__
    inlineScript(`window.__PRELOADED_STATE__=${serialize(props.preloadedState)};`),
    // Polyfill whatever the browser doesnt provide that is necessary
    // for the application to run. Much lighter than using babel-polyfill
    // and results in smaller bundles.
    createScriptElement('https://cdn.polyfill.io/v2/polyfill.min.js?features=default,Symbol'),
     ifElse(isProd && clientAssets && clientAssets.common.js)(() =>
      createScriptElement(clientAssets.common.js),
    ),
    ifElse(isProd && clientAssets && clientAssets.vendor.js)(() =>
      createScriptElement(clientAssets.vendor.js),
    ),
    ifElse(isDev)(() => createScriptElement(`/__vendor_dlls__.js?t=${Date.now()}`)),
    ifElse(clientAssets && clientAssets.main.js)(() => createScriptElement(clientAssets.main.js)),
    ...ifElse(helmet)(() => helmet.script.toComponent(), []),
  ]);

  return (
    <Html
      htmlAttributes={ifElse(helmet)(() => helmet.htmlAttributes.toComponent(), null)}
      headerElements={headerElements.map((x, idx) =>
        <KeyedComponent key={idx}>{x}</KeyedComponent>,
      )}
      bodyElements={bodyElements.map((x, idx) => <KeyedComponent key={idx}>{x}</KeyedComponent>)}
      appBodyString={reactAppString}
    />
  );
}
const propTypes = {
  reactAppString: string,
  nonce: string,
  preloadedState: object,
  styledCss: object,
  helmet: element,
};

CreateHtml.propTypes = propTypes;
