import React from 'react';
import renderer from 'react-test-renderer';

import LoadingIndicator from '../index';

jest.useFakeTimers();
Date.now = jest.fn(() => 1482363367071);

it('renders and matches the snapshot', () => {
  const tree = renderer.create(<LoadingIndicator />).toJSON();
  expect(tree).toMatchSnapshot();
});
