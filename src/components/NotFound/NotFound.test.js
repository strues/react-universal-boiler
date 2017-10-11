import React from 'react';
import renderer from 'react-test-renderer';
import NotFound from './NotFound';

jest.useFakeTimers();
Date.now = jest.fn(() => 1482363367071);

it('renders correctly', () => {
  const tree = renderer.create(<NotFound />).toJSON();
  expect(tree).toMatchSnapshot();
});
