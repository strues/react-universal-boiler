import React from 'react';
import renderer from 'react-test-renderer';

import Circle from '../Circle';

jest.useFakeTimers();
Date.now = jest.fn(() => 1482363367071);

it('renders and matches the snapshot', () => {
  const tree = renderer.create(<Circle />).toJSON();
  expect(tree).toMatchSnapshot();
});
