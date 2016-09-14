import React, { Component, PropTypes } from 'react';
import styles from './App.scss';

const App = (props) => {
  return (
      <div>
        { props.children }
      </div>
  );
};

export default App;
