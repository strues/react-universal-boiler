import React from 'react';
import styles from './styles.scss';

function Tools() {
  return (
    <ul className={styles.tools}>
      <li>
        <a href="https://expressjs.com/">Express</a> - server-side rendering
      </li>
      <li>
        <a href="https://facebook.github.io/react/">React</a> - component library
      </li>
      <li>
        <a href="https://github.com/reactjs/react-router">React Router</a> - server and browser
        routing
      </li>
      <li>
        <a href="https://github.com/css-modules/css-modules">Sass Modules</a> - r styles
      </li>
      <li>
        <a href="https://github.com/airbnb/enzyme">Enzyme</a> - React component testing
      </li>
    </ul>
  );
}

export default Tools;
