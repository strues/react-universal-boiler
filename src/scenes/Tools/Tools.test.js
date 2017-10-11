import React from 'react';
import renderer from 'react-test-renderer';
import Tools from './Tools';

jest.useFakeTimers();
Date.now = jest.fn(() => 1482363367071);

it('renders correctly', () => {
  const tree = renderer.create(<Tools />).toJSON();
  expect(tree).toMatchSnapshot();
});
