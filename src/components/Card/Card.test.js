import React from 'react';
import { shallow } from 'enzyme';
import sinon from 'sinon';

import Heading from '../Heading';
import TextBlock from '../TextBlock';
import Card from './Card';

describe('<Card />', () => {
  let requiredProps = {};

  beforeEach(() => {
    requiredProps = {
      route: '/my-awesome-page',
      title: 'My awesome page',
      text: 'This Card teases a different page with an image, a Heading and a short descrition.',
      image: 'http://placehold.it/350x150'
    };
  });

  it('should render the title.', () => {
    const wrapper = shallow(<Card { ...requiredProps } />);
    const textblock = wrapper.find(TextBlock);

    expect(textblock).to.have.length(1);
    expect(textblock.html()).to.contain(
      'This Card teases a different page with an image, a Heading and a short descrition.');
  });

  it('should propagate props to the wrapper element.', () => {
    const handler = sinon.spy();
    const wrapper = shallow(<Card { ...requiredProps } onClick={ handler } />);

    wrapper.simulate('click');

    expect(handler.calledOnce).to.equal(true);
  });
});
