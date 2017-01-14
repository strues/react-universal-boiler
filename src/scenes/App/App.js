import React, { Component, PropTypes } from 'react';
import Link from 'react-router/lib/Link';
import { Navigation, Button } from '../../components';

const App = (props) => {
  return (
      <div>
        <Navigation>
          <Link to="/">
            <Button display="primary">Home</Button>
          </Link>
          <a href="https://github.com/strues/boldr-universal-react"><Button>GitHub</Button></a>
        </Navigation>
          { props.children }
      </div>
  );
};

App.propTypes = {
  children: PropTypes.element
};

export default App;
