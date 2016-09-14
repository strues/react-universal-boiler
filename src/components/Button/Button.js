import React, { PropTypes } from 'react';
import Link from 'react-router/lib/Link';

const Button = (props) => {
  return (
    <button type="button">
      {
        props.href ?
        <Link to={ props.href }>{ props.text }</Link> :
        props.text
      }
    </button>
  );
};

Button.propTypes = {
  text: PropTypes.string.isRequired,
  href: PropTypes.string
};

export default Button;
