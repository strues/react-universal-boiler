/* eslint-env mocha */
import React from 'react';
import { shallow } from 'enzyme';
import { expect } from 'chai';
import Home from './Home';

describe('<Home />', () => {
  it('renders without blowing up the browser', () => {
    const wrapper = shallow(<Home />);
    expect(wrapper.find('h1')).to.have.length(1);
  });
});
