import React from 'react';
import { shallow, mount } from 'enzyme';
import Navigation from './Navigation';

describe('<Navigation />', () => {
  it('should render a nav element', () => {
    const wrapper = shallow(<Navigation />);
    expect(wrapper.type()).to.equal('nav');
  });
});
