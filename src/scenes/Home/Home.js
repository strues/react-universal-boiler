import React, { Component } from 'react';
import Helmet from 'react-helmet';
import { Page, Row, Column } from 'hedron';
import { connect } from 'react-redux';
import { object, arrayOf, func } from 'prop-types';
import { fetchPosts, fetchPostsIfNeeded } from '../../state/modules/posts';
import Loading from '../../components/Loading';
import Post from '../../components/Post';

class Home extends Component {
  static displayName = 'Home';
  static propTypes = {
    posts: object,
    dispatch: func,
  };
  static fetchData({ store }) {
    return store.dispatch(fetchPosts());
  }

  componentDidMount() {
    this.props.dispatch(fetchPostsIfNeeded());
  }

  refresh = () => {
    this.props.dispatch(fetchPosts());
  };
  renderPosts = () => {
    return (
      <Row>
        {this.props.posts.list.map(p =>
          <Column fluid sm={12} md={4} key={p.id}>
            <Post title={p.title} body={p.body} />
          </Column>,
        )}
      </Row>
    );
  };
  render() {
    return (
      <div>
        <Page>
          <Helmet title="Home" />
          <Row>
            <Column sm={8} smShift={2} lg={6} lgShift={3}>
              <div className="wrapper">
                <h1>React Universal Boiler</h1>
                <p>A server rendering React project.</p>
              </div>
            </Column>
          </Row>
          <p><button onClick={this.refresh}>Refresh</button></p>
          <div>
            {this.props.posts.isFetching ? <Loading /> : this.renderPosts()}
          </div>
        </Page>
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    posts: state.posts,
    list: state.posts.list,
  };
};
export default connect(mapStateToProps)(Home);
