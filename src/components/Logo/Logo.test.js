import React from 'react';
import { shallow, mount } from 'enzyme';
import Logo from './Logo';

describe('<Logo />', () => {
  it('should render the svg', () => {
    const wrapper = shallow(<Logo />);
    expect(wrapper.type()).to.equal('svg');
  });
});
