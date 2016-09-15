import React, { Component, PropTypes } from 'react';
import 'normalize.css/normalize.css';
import { Navigation, Button } from 'components';
import styles from './App.scss';

const App = (props) => {
  return (
      <div>
        <Navigation>
          <Button text="Home" />
          <Button text="Going Nowheres" />
        </Navigation>
        { props.children }
      </div>
  );
};

App.propTypes = {
  children: PropTypes.element
};

export default App;
