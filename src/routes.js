import universal from 'react-universal-component';
import Home from './scenes/Home';
import Tools from './scenes/Tools';

const UniversalTools = universal(() => import('./scenes/Tools'), {
  resolve: () => require.resolveWeak('./scenes/Tools'),
});

export default [
  {
    path: '/',
    exact: true,
    component: Home,
  },
  {
    path: '/tools',
    exact: true,
    component: Tools,
  },
];
