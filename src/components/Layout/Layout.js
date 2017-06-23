import React from 'react';
import Link from 'react-router-dom/Link';
import Helmet from 'react-helmet';
import PropTypes from 'prop-types';

const Layout = props =>
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
    <Link to="/tools">Tools</Link>
    <section>
      {props.children}
    </section>
  </div>;

const propTypes = {
  children: PropTypes.object,
};

Layout.propTypes = propTypes;

export default Layout;
