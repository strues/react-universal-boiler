import React, { PropTypes } from 'react';
import ReactDOM from 'react-dom/server';
import serialize from 'serialize-javascript';
import Helmet from 'react-helmet';

export default class Html extends React.Component {
  static propTypes = {
    assets: PropTypes.object,
    component: PropTypes.node,
    store: PropTypes.object
  };
  
  get styles() {
    const { assets } = this.props
    const { styles, assets: _assets } = assets
    const stylesArray = Object.keys(styles)
    
    // styles (will be present only in production with webpack extract text plugin)
    if (stylesArray.length !== 0) {
      return stylesArray.map((style, i) =>
        <link href={assets.styles[style]} key={i} rel="stylesheet" type="text/css" media="screen, projection" charSet="UTF-8" />
      );
    }
    
    // (will be present only in development mode)
    // It's not mandatory but recommended to speed up loading of styles
    // (resolves the initial style flash (flicker) on page load in development mode)
    const scssPaths = Object.keys(_assets).filter(asset => asset.includes('.css'))
    return scssPaths.map((style, i) =>
      <style dangerouslySetInnerHTML={{ __html: _assets[style]._style }} key={i} />
    );
  }
  
  render() {
    const { assets, component, store } = this.props;
    const content = component ? ReactDOM.renderToString(component) : '';
    const head = Helmet.rewind();
    const preloadedState = store.getState();
    return (
      <html lang="en-us">
        <head>
          <Helmet />
          { head.base.toComponent() }
          { head.title.toComponent() }
          { head.meta.toComponent() }
          { head.link.toComponent() }
          { head.script.toComponent() }

          <meta name="viewport" content="width=device-width, initial-scale=1" />
          { this.styles }
          {
            Object.keys(assets.styles).length === 0 ?
            <style dangerouslySetInnerHTML={ { __html: '#content{display:none}' } } /> :
            null
          }
        </head>
        <body>
          <div id="content" dangerouslySetInnerHTML={ { __html: content } } />
          <script dangerouslySetInnerHTML={ {
            __html: `window.__PRELOADED_STATE=${serialize(preloadedState)};` } }
            charSet="UTF-8"
          />
        { __DLLS__ ?
          <script key="dlls__vendor" src="/assets/dlls/dll__vendor.js" charSet="UTF-8" /> :
          <script key="vendor" src={ assets.javascript.vendor } charSet="UTF-8" />
        }
        <script src={ assets.javascript.main } charSet="UTF-8" />
      {
        Object.keys(assets.styles).length === 0 ?
        <script dangerouslySetInnerHTML={ { __html: 'document.getElementById("content").style.display="block";' } } />
        : null
      }
        </body>
      </html>
    );
  }
}
