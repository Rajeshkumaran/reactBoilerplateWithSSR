/**
 * app.js
 *
 * This is the entry file for the application, only setup and boilerplate
 * code.
 */

// Needed for redux-saga es6 generator support
import '@babel/polyfill';

// Import all the third party stuff
import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { ConnectedRouter } from 'connected-react-router/immutable';
import history from 'utils/history';
import { renderRoutes } from 'react-router-config';
import 'sanitize.css/sanitize.css';

// Load the favicon and the .htaccess file
/* eslint-disable import/no-unresolved, import/extensions */
import '!file-loader?name=[name].[ext]!./images/favicon.ico';
import 'file-loader?name=.htaccess!./.htaccess';
/* eslint-enable import/no-unresolved, import/extensions */

import configureStore from 'configureStore';
import routes from 'config/routes';

const DEV = process.env.NODE_ENV === 'development';
// Create redux store with history
const initialState = {};
const store = configureStore(initialState, history);
const MOUNT_NODE = document.getElementById('app');
/*eslint-disable */
const render = route =>
  ReactDOM.hydrate(
    <Provider store={store}>
      <ConnectedRouter history={history}>{renderRoutes(route)}</ConnectedRouter>
    </Provider>,
    MOUNT_NODE,
  );

render(routes);
console.log('module :', routes);
if (DEV && module.hot) {
  // Hot reloadable React components and translation json files
  // modules.hot.accept does not accept dynamic dependencies,
  // have to be constants at compile-time
  console.log('module.hot called');
  module.hot.accept(['config/routes'], () => {
    ReactDOM.unmountComponentAtNode(MOUNT_NODE);
    const updatedRoutes = require('config/routes');
    render(updatedRoutes);
  });
}

// Install ServiceWorker and AppCache in the end since
// it's not most important operation and if main code fails,
// we do not want it installed
if (process.env.NODE_ENV === 'production') {
  require('offline-plugin/runtime').install(); // eslint-disable-line global-require
}
