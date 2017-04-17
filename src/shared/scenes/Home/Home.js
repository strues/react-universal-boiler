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
            {this.props.posts.map(d => (
              <div className="grid__col-xs" key={d.id}>
                <h3>{d.title}</h3>
                <p>
                  {d.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }
}

export default Home;
