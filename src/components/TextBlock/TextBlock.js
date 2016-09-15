import React, { PropTypes } from 'react';
import cxN from 'classnames';
import style from './TextBlock.scss';

/**
 * The TextBlock should be used to display long strings.
 * A good rule is to separate long texts in TextBlock after the third row.
 */
const TextBlock = ({ className, isLead, children, ...rest }) => {
  const finalClassName = cxN({
    [style.paragraph]: true,
    [style.lead]: isLead,
    [className]: className && className.length
  });

  return (
    <p { ...rest } className={ finalClassName }>
			{ children }
		</p>
    );
};

TextBlock.propTypes = {
  children: PropTypes.node.isRequired,
  // If set to `true` the TextBlock will be displayed in a slightly bigger manner.
  isLead: PropTypes.bool,
  className: PropTypes.string
};

TextBlock.defaultProps = {
  isLead: false
};

export default TextBlock;
