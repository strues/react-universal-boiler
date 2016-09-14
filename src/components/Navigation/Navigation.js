import React, { PropTypes } from 'react';

const Navigation = (props) => {
  return (
    <nav>
      Navigation
      { props.children }
    </nav>
  );
};

Navigation.propTypes = {
  children: PropTypes.array
};

export default Navigation;
