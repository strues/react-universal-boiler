import React, { PropTypes } from 'react';
import cxN from 'classnames';
import Link from 'react-router/lib/Link';
import { Heading, TextBlock } from '../index';
import style from './Card.css';

/**
* A Card teases a different page with an image, a headline and a short descrition.
*/
const Card = ({ image, route, title, text, className, ...rest }) => {
  const finalClassName = cxN({
    [style.card]: true,
    [className]: className && className.length
  });

  return (
    <div { ...rest } className={ finalClassName }>
			<Link to={ route }>
				<img className={ style.cardImage } src={ image } />
			</Link>
			<div className={ style.contents }>
				<Heading type="h4">{ title }</Heading>
				<TextBlock>{ text }</TextBlock>
			</div>
		</div>
    );
};
Card.propTypes = {
  /**
   * The route where the card image will link to.
   */
  route: PropTypes.string.isRequired,

  /**
   * The `src` of the image tag.
   */
  image: PropTypes.string.isRequired,

  /**
   * The title of the page to be teased.
   */
  title: PropTypes.string.isRequired,

  /**
   * The description of the page to be teased.
   */
  text: PropTypes.string.isRequired,
  className: PropTypes.string
};

export default Card;
