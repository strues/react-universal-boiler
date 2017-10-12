// @flow
import React, { Component } from 'react';
import Helmet from 'react-helmet';
import { connect } from 'react-redux';
import type { Connector } from 'react-redux';
import { fetchPosts, fetchPostsIfNeeded } from '../../state/modules/posts';
import Post from '../../components/Post';
import type { PostsReducer, Dispatch, Reducer } from '../../types';
// $FlowIssue
import styles from './style.scss';

type Props = {
  posts: PostsReducer,
  fetchPostsIfNeeded: () => void,
};

export class Home extends Component<Props, *> {
  static displayName = 'Home';

  static fetchData({ store }) {
    return store.dispatch(fetchPosts());
  }

  componentDidMount() {
    this.props.fetchPostsIfNeeded();
  }

  render() {
    return (
      <div>
        <Helmet title="Home" />
        <div className="row">
          <div className="column">
            <div className={styles.hero}>
              <h1>React Universal Boiler</h1>
              <p>A server rendering React project.</p>
            </div>
          </div>
        </div>

        <div className="posts-list">
          {this.props.posts.list.map(p => (
            <div className="column column-30" key={p.id}>
              <Post title={p.title} body={p.body} />
            </div>
          ))}
        </div>
      </div>
    );
  }
}

const connector: Connector<{}, Props> = connect(
  ({ posts }: Reducer) => ({ posts }),
  (dispatch: Dispatch) => ({
    fetchPostsIfNeeded: () => dispatch(fetchPostsIfNeeded()),
  }),
);

export default connector(Home);
