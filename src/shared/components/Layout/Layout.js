import React from 'react';
import Link from 'react-router-dom/Link';
import PropTypes from 'prop-types';

const Layout = props => (
  <div>
    <nav className="navigation">
      <Link to="/tools">Tools</Link>
    </nav>
    <main className="container">{props.children}</main>
  </div>
);

const propTypes = {
  children: PropTypes.object,
};

Layout.propTypes = propTypes;

export default Layout;
