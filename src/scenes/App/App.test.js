/* eslint-env mocha */
import React from 'react';
import { shallow } from 'enzyme';
import { expect } from 'chai';
import App from './App';

describe('<App />', () => {
  it('renders without blowing up the browser', () => {
    const wrapper = shallow(<App />);
  });
});
