/**
 * routes.js
 *
 * This file defines front-end routes and its corresponding components
 *
 */
import AppWrapper from 'containers/App';
import HomePage from 'containers/HomePage';
const routes = [
  {
    component: AppWrapper,
    key: 'APP',
    routes: [
      {
        path: '/',
        exact: true,
        component: HomePage,
        key: 'HOME',
      },
      {
        path: '/home',
        exact: true,
        component: HomePage,
        key: 'LIST',
      },
    ],
  },
];

export default routes;
