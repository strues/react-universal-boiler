import React, { PropTypes } from 'react';

const Navigation = (props) => {
  return (
    <nav id="navbar">
      { props.children }
    </nav>
  );
};

Navigation.propTypes = {
  children: PropTypes.array
};

export default Navigation;
