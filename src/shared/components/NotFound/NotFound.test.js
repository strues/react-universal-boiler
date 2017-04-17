import React from 'react';

import NotFound from './NotFound';

test('<NotFound />', () => {
  const wrapper = mount(<NotFound />);

  expect(wrapper.find('.header')).toIncludeText('Not Found');
});
