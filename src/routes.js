import Home from './scenes/Home';
import Tools from './scenes/Tools';

export default [
  {
    path: '/',
    exact: true,
    component: Home,
    // This is important for fetching data asynchronously.
  },
  {
    path: '/tools',
    exact: true,
    component: Tools,
  },
];
