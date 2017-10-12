import React, { Component } from 'react';
import Helmet from 'react-helmet';
import { connect } from 'react-redux';
import { object, func } from 'prop-types';
import { fetchPosts, fetchPostsIfNeeded } from '../../state/modules/posts';
import Post from '../../components/Post';
import styles from './style.scss';

export class Home extends Component {
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

const mapStateToProps = state => {
  return {
    posts: state.posts,
  };
};
export default connect(mapStateToProps)(Home);
