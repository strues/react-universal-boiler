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

Layout.propTypes = {
  children: PropTypes.object,
};

export default Layout;
