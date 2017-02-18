import React, { Component, PropTypes } from 'react';
import Helmet from 'react-helmet';
import { connect } from 'react-redux';

import { Heading, Card, Row, Col, Grid, TextBlock } from '../../components';
// import { fetchPosts } from './actions';
import './style.scss';


class Home extends Component {
  static displayName = 'Home';

  static propTypes = {
    posts: PropTypes.object
  }

  render() {
    const { appData } = this.props;
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
          <Row>

            <ul>
            {
              this.props.app.loading ? <p>Loading....</p> : this.props.app.data.results.map(result =>
                <li key={ result.id }>{result.title}</li>
              )
            }
          </ul>
          </Row>
          </Grid>
          </div>
      </div>
    );
  }
}
const mapStateToProps = (state) => {
  return {
    app: state.app,
  };
};
export default connect(mapStateToProps)(Home);
