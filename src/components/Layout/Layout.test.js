import React from 'react';
import renderer from 'react-test-renderer';
import MemoryRouter from 'react-router-dom/MemoryRouter';
import Layout from './Layout';

jest.useFakeTimers();
Date.now = jest.fn(() => 1482363367071);

it('renders correctly', () => {
  const tree = renderer
    .create(
      <MemoryRouter>
        <Layout />
      </MemoryRouter>,
    )
    .toJSON();
  expect(tree).toMatchSnapshot();
});
