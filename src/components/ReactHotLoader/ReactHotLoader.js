/* @flow */
import React from 'react';

const IS_DEV = process.env.NODE_ENV === 'development';

const ReactHotLoader = IS_DEV
? require('react-hot-loader').AppContainer
: ({ children }: { children?: ReactChildren}) => React.Children.only(children);

export default ReactHotLoader;
