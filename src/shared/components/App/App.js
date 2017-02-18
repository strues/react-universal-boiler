import React, { Component, PropTypes } from 'react';
import { Route, Switch } from 'react-router-dom';
import { connect } from 'react-redux';
import { Navigation, Button } from '../index';
import NotFound from '../NotFound';
import Home from '../../scenes/Home';

import { getAppData } from '../../state/modules/app';

class App extends Component {
  static displayName = 'App';

  componentWillMount() {
    this.props.getAppData();
  }
  render() {
    const { app } = this.props;
    return (
      <div>
        <Navigation>
          <Switch>
            <Route exact path="/" children={({ match }) => (
              <Home appData={ app }/>
            )}/>
            <Route component={NotFound} />
          </Switch>
          <a href="https://github.com/strues/boldr-universal-react"><Button>GitHub</Button></a>
        </Navigation>
      </div>
    );
  }
}

App.propTypes = {
  children: PropTypes.element
};

const mapStateToProps = state => ({
  app: state.app
});

export default connect(mapStateToProps, { getAppData })(App);
