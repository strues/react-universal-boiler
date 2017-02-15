import React, { Component, PropTypes } from 'react';

import Helmet from 'react-helmet';
import { provideHooks } from 'redial';
import { connect } from 'react-redux';

import { Heading, Card, Row, Col, Grid, TextBlock } from '../../components';
import { fetchPosts } from './actions';
import './style.scss';


class Home extends Component {
  static propTypes = {
    posts: PropTypes.object
  }
  render() {
    return (
      <div>
        <Helmet title="Home" />
        <div className="wrapper">
          <Grid>
          <Row>
            <Col xs>
              <Heading type="h1" style={ { paddingTop: '50px' } }>React Universal Boiler</Heading>
              <TextBlock className="home__text-block">
              The data below pulls from an external API and waits for the request to resolve before rendering the page.
              </TextBlock>
            </Col>
          </Row>
          </Grid>
          </div>
      </div>
    );
  }
}

export default Home;
