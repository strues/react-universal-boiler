import App from './components/App';
import HomeContainer from './scenes/Home';
import NotFound from './components/NotFound';
import Tools from './scenes/Tools';

import { getAppData } from './state/modules/app';

export default [
  {
    component: App,
    routes: [
      {
        path: '/',
        exact: true,
        component: HomeContainer,
        loadData: async (dispatch: Dispatch) =>
          Promise.all([await dispatch(getAppData())]),
      },
      {
        path: '/tools',
        exact: true,
        component: Tools,
      },
      {
        path: '*',
        component: NotFound,
      },
    ],
  },
];
