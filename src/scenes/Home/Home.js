import React, { Component, PropTypes } from 'react';
import Helmet from 'react-helmet';
import { provideHooks } from 'redial';
import { connect } from 'react-redux';

import { Heading, Card, Row, Col, Grid, TextBlock } from 'components';
import { fetchPosts } from './actions';

const mapStateToProps = (state) => {
  return {
    posts: state.posts,
    loading: state.posts.loading
  };
};

@provideHooks({
  fetch: ({ dispatch }) => dispatch(fetchPosts())
})
@connect(mapStateToProps, { fetchPosts })
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
              <TextBlock>The data below pulls from an external API and waits for the request to resolve before
              rendering the page.</TextBlock>
            </Col>
          </Row>
          </Grid>
          </div>
          <Grid>
            <Row>
            {
              this.props.posts.data.map(post =>
              <Col xs={ 12 } md={ 4 } key={ post.id }>
                <Card
                  title={ post.title }
                  route="/"
                  image={ post.feature_image }
                  text={ post.excerpt }
                  style={ { marginLeft: '1rem', marginRight: '1rem' } }
                />
              </Col>)
            }
            </Row>
        </Grid>
      </div>
    );
  }
}

export default Home;
