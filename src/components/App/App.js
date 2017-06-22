import React, { Component } from 'react';
import Helmet from 'react-helmet';
import { connect } from 'react-redux';
import { object } from 'prop-types';
import { injectGlobal } from 'styled-components';

import renderRoutes from '../../util/addRoutes';
import '../../styles/main.scss';

injectGlobal`
  body {
    font-family: sans-serif;
    margin: 0;
  }
`;

class App extends Component {
  static displayName = 'AppComponent';
  static propTypes = {
    route: object,
  };
  render() {
    const { route } = this.props;
    return (
      <div>
        <Helmet titleTemplate="React Universal Boiler - %s">
          <html lang="en" />
          <title>React Universal Boiler</title>
          <meta name="application-name" content="React Universal Boiler" />
          <meta name="description" content="A server rendering React project." />
          <meta charSet="utf-8" />
          <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <meta name="msapplication-TileColor" content="#2b2b2b" />
        </Helmet>
        <div>
          {renderRoutes(route.routes)}
        </div>
      </div>
    );
  }
}

export default App;
