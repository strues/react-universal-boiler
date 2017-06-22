import React, { Component } from 'react';
import { connect } from 'react-redux';
import { arrayOf, object, func } from 'prop-types';
import { getAppData } from '../../state/modules/app';
import Home from './Home';

class HomeContainer extends Component {
  static displayName = 'HomeContainer';
  static propTypes = {
    getAppData: func,
    data: arrayOf(object),
  };
  static defaultProps = {
    getAppData: () => {},
  };

  componentDidMount() {
    this.props.getAppData();
  }

  render() {
    const { data } = this.props;

    return <Home posts={data} />;
  }
}
const mapStateToProps = state => {
  return {
    data: state.app.data,
  };
};
export default connect(mapStateToProps, { getAppData })(HomeContainer);
