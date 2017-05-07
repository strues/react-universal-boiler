/* @flow */
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { getAppData } from '../../state/modules/app';
import Home from './Home';

type Props = {
  getAppData: () => void,
  data: Array<Object>,
};

class HomeContainer extends Component {
  static displayName = 'HomeContainer';
  static defaultProps = {
    getAppData: () => {},
  };

  componentDidMount() {
    this.props.getAppData();
  }
  props: Props;
  render() {
    const { data } = this.props;

    return (
      <Home posts={data} />
    );
  }
}
const mapStateToProps = state => {
  return {
    data: state.app.data,
  };
};
export default connect(mapStateToProps, { getAppData })(HomeContainer);
