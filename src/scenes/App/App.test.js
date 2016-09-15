/* eslint-env mocha */
import React from 'react';
import { shallow } from 'enzyme';
import { expect } from 'chai';

import { Navigation, Button } from '../../components';
import App from './App';

describe('<App />', () => {
  it('renders without blowing up the browser', () => {
    const wrapper = shallow(<App />);
  });
  it('renders the <Navigation />', () => {
    const wrapper = shallow(<App />);
    expect(wrapper.find(Navigation)).to.have.length(1);
  });
  it('renders the <Button />', () => {
    const wrapper = shallow(<App />);
    expect(wrapper.find(Button)).to.have.length(2);
  });
});
