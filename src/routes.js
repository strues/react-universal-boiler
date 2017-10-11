import universal from 'react-universal-component';
import Home from './scenes/Home';
import Loader from './components/Loader';
import NotFound from './components/NotFound';

const Tools = universal(() => import('./scenes/Tools'), {
  minDelay: 1200,
  loading: Loader,
  error: NotFound,
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
