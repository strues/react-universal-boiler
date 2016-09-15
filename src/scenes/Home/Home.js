import React, { Component, PropTypes } from 'react';
import Helmet from 'react-helmet';
import { provideHooks } from 'redial';
import { connect } from 'react-redux';

import { Heading, Card, Row, Col, Grid } from 'components';
import { fetchPosts } from './actions';
import styles from './Home.scss';

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
        <div>
        <Heading type="h1">Home</Heading>
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
      </div>
    );
  }
}

export default Home;
