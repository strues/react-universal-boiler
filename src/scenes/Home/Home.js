import React, { Component } from 'react';
import Helmet from 'react-helmet';
import { Page, Row, Column } from 'hedron';
import { connect } from 'react-redux';
import universal from 'react-universal-component';
import { object, arrayOf, func } from 'prop-types';
import { fetchPosts, fetchPostsIfNeeded } from '../../state/modules/posts';
import Loading from '../../components/Loading';
import Post from '../../components/Post';

const UniversalExample = universal(() => import('./Example'), {
  resolve: () => require.resolveWeak('./Example'),
});

class Home extends Component {
  static displayName = 'Home';
  static propTypes = {
    posts: object,
    dispatch: func,
  };

  static fetchData({ store }) {
    return store.dispatch(fetchPosts());
  }

  state = {
    show: false,
  };
  componentDidMount() {
    this.props.dispatch(fetchPostsIfNeeded());
    if (this.state.show) {
      return;
    }

    setTimeout(() => {
      console.log('now showing <Example />');
      this.setState({ show: true });
    }, 1500);
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
        <Helmet title="Home" />
        <Page>
          <Row>
            <Column sm={8} smShift={2} lg={6} lgShift={3}>
              <div className="wrapper">
                <h1>React Universal Boiler</h1>
                <p>A server rendering React project.</p>
              </div>
            </Column>
          </Row>
          {!this.state.show && 'Async Component Not Requested Yet'}
          {this.state.show && <UniversalExample />}
          <p><button onClick={this.refresh}>Refresh</button></p>
          <div>
            {this.props.posts.isFetching ? <Loading /> : <Post posts={this.props.posts.list} />}
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
