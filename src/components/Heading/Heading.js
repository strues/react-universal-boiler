import React, { PropTypes } from 'react';
import cxN from 'classnames';
import styles from './Heading.scss';

const validTypes = ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'];

/**
 *  A Heading should always be the visual and describing start of another content section.
 * @param {string} className define a css class to use
 * @param {string} type      h1, h2, h3, h4, h5, h6 -- web standard
 * @param {string} theme     optional theme className
 * @param {node} children  react child element
 */
const Heading = ({ className, type, theme, children, ...rest }) => {
  const themeClassName = styles[theme] || styles[type];
  const finalClassName = cxN({
    [styles.h]: true,
    [themeClassName]: true,
    [className]: className && className.length
  });

  switch (type) {
    case 'h1':
      return <h1 { ...rest } className={ finalClassName }>{children}</h1>;
    case 'h2':
      return <h2 { ...rest } className={ finalClassName }>{children}</h2>;
    case 'h3':
      return <h3 { ...rest } className={ finalClassName }>{children}</h3>;
    case 'h4':
      return <h4 { ...rest } className={ finalClassName }>{children}</h4>;
    case 'h5':
      return <h5 { ...rest } className={ finalClassName }>{children}</h5>;
    case 'h6':
      return <h6 { ...rest } className={ finalClassName }>{children}</h6>;
    default:
      return '';
  }
};
Heading.propTypes = {
  children: PropTypes.node.isRequired,

  /**
   * The semantic type of the heading, default to `h1`.
   */
  type: PropTypes.oneOf(validTypes),

  /**
   * To separate the semantic meaning and the visual styles,
   * you can also set an optional theme, to have the semantic
   * meaning of a `h1` but the visual appearance of a `h4`.
   */
  theme: PropTypes.oneOf(validTypes),
  className: PropTypes.string
};
Heading.defaultProps = {
  type: 'h1'
};

export default Heading;
