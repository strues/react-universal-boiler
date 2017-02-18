import React, { PropTypes } from 'react';
import classnames from 'classnames';
import './Button.scss';

const Button = (props) => {
  const classes = classnames(
    'btn',
    props.display,
    props.size,
    props.className,
    { block: props.block },
    { active: props.active }
  );

  const attributes = {
    disabled: props.disabled,
    id: props.id,
    onClick: !props.disabled && props.onClick,
    type: props.type
  };
  return (
    <button className={ classes } { ...attributes }>
      { props.text || props.children }
    </button>
  );
};

Button.propTypes = {
  active: PropTypes.bool,
  block: PropTypes.bool,
  text: PropTypes.string,
  children: PropTypes.node,
  className: PropTypes.string,
  disabled: PropTypes.bool,
  display: PropTypes.oneOf(['primary', 'link']),
  id: PropTypes.string,
  onClick: PropTypes.func,
  size: PropTypes.oneOf(['large', 'small']),
  type: PropTypes.oneOf(['button', 'submit', 'reset'])
};

export default Button;
