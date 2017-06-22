/* eslint-disable jsx-a11y/html-has-lang, react/forbid-prop-types */
import React from 'react';
import { object, node, string } from 'prop-types';

function Html(props) {
  const { htmlAttributes, headerElements, bodyElements, appBodyString } = props;

  return (
    <html {...htmlAttributes}>
      <head>
        {headerElements}
      </head>
      <body>
        <div id="app" dangerouslySetInnerHTML={{ __html: appBodyString }} />
        {bodyElements}
      </body>
    </html>
  );
}

Html.propTypes = {
  htmlAttributes: object,
  headerElements: node,
  bodyElements: node,
  appBodyString: string,
};

Html.defaultProps = {
  htmlAttributes: null,
  headerElements: null,
  bodyElements: null,
  appBodyString: '',
};

export default Html;
