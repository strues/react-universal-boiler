import React from 'react';
import renderer from 'react-test-renderer';
import Post from './Post';

jest.useFakeTimers();
Date.now = jest.fn(() => 1482363367071);

it('renders correctly', () => {
  const tree = renderer.create(<Post title="Foo" body="Bar" />).toJSON();
  expect(tree).toMatchSnapshot();
});
