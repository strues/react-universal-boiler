import React, { Component, PropTypes } from 'react';

import { Navigation, Button } from '../../components';
import styles from './App.scss';

const App = (props) => {
  return (
      <div>
        <Navigation>
          <Button text="Home" href="/" />
          <Button text="LastFM" href="lastfm" />
        </Navigation>
        { props.children }
      </div>
  );
};

App.propTypes = {
  children: PropTypes.element
};

export default App;
