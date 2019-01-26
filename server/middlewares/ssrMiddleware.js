import React from 'react';
import { renderToString } from 'react-dom/server';
import { createMemoryHistory } from 'history';
import { matchRoutes } from 'react-router-config';
import routes from 'config/routes';
import configureStore from 'configureStore';
import Html from '../Html';
const renderPage = (req, res) => {
  console.log('req called', req.url);
  // Create redux store with history and it has to be done for each and every request
  const initialState = {};
  const history = createMemoryHistory({
    initialEntries: [req.url],
  });
  const store = configureStore(initialState, history);

  const branch = matchRoutes(routes, req.url);

  const promises = branch.map(({ route, match }) => {
    const { component } = route;
    if (route.loadData instanceof Function) {
      return route.loadData(match, store);
    } else if (component.fetchData instanceof Function) {
      return component.fetchData(match, store);
    } else if (component.preload instanceof Function) {
      /* This means that added component is a React Loadable component */
      return new Promise((resolve, reject) => {
        component
          .preload()
          .then(comp => {
            if (comp.default && comp.default.fetchData instanceof Function) {
              /* This means that the preloaded component is a class and it has a static method fetchData */
              return comp.default.fetchData(match, store);
            }
            return Promise.resolve(true);
          })
          .then(() => resolve(true), err => reject(err));
      });
    }
    return Promise.resolve(null);
  });
  return Promise.all(promises).then(() => {
    const { url = '/' } = req;
    const context = {};
    const html = renderToString(<Html {...{ url, store, context }} />);
    res.send(`<!DOCTYPE html> ${html}`);
  });
};

export default renderPage;
