import React, { Component } from 'react';
import Helmet from 'react-helmet';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { injectGlobal, ThemeProvider } from 'styled-components';
import renderRoutes from '../../core/addRoutes';
import '../../styles/main.scss';

injectGlobal`
  body {
    margin: 0;
  }
`;
class App extends Component {
  static displayName = 'AppComponent';
  static propTypes = {
    route: PropTypes.object.isRequired,
  };
  render() {
    const { route } = this.props;
    return (
      <div>
        <Helmet>
          <html lang="en" />
          <title>Boldr</title>
          <meta name="application-name" content="Boldr" />
          <meta name="description" content="A modern, bold take on a cms" />
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
