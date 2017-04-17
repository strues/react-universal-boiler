/* @flow */
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import Helmet from 'react-helmet';
import { connect } from 'react-redux';

type Props = {
  posts: Array<Object>,
};

class Home extends PureComponent {
  static displayName = 'Home';
  props: Props;
  render() {
    return (
      <div>
        <Helmet title="Home" />
        <div className="wrapper">
          <h1>React Universal Boiler</h1>
          <p>A server rendering React project.</p>
        </div>
        <div className="grid--fluid">
          <div className="row">

          </div>
        </div>
      </div>
    );
  }
}

export default Home;
