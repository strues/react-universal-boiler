/* @flow */
import React, { PureComponent } from 'react';
import Helmet from 'react-helmet';
import { Page, Row, Column } from 'hedron';
import Post from '../../components/Post';

type Props = {
  posts: Array<Object>,
};

class Home extends PureComponent {
  static displayName = 'Home';

  props: Props;

  render() {
    return (
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
        <Row>
          {this.props.posts
            ? this.props.posts.map(p => (
                <Column fluid sm={12} md={4} key={p.id}>
                  <Post title={p.title} body={p.body} />
                </Column>
              ))
            : <span>Loading...</span>}
        </Row>
      </Page>
    );
  }
}

export default Home;
