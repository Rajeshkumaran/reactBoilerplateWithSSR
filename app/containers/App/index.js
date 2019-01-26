/**
 *
 * App.js
 *
 * This component is the skeleton around the actual pages, and should only
 * contain code that should be seen on all pages. (e.g. navigation bar)
 *
 */

import React from 'react';
import { renderRoutes } from 'react-router-config';

export default class App extends React.Component {
  render() {
    return (
      <React.Fragment>{renderRoutes(this.props.route.routes)}</React.Fragment>
    );
  }
}
