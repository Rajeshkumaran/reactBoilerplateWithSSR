import path from 'path';
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { StaticRouter } from 'react-router-dom';
import { renderToString } from 'react-dom/server';
import Loadable from 'react-loadable';
import { renderStylesToString } from 'emotion-server';
import { ThemeProvider } from 'emotion-theming';
import { Provider } from 'react-redux';
import { renderRoutes } from 'react-router-config';
import { getBundles } from 'react-loadable/webpack';

import routes from 'config/routes';
import themeObject from 'theme'; // app/theme.js

const ASSEST_MANIFEST_PATH = 'build/asset-manifest.json';
const REACT_LOADABLE_JSON_PATH = 'build/react-loadable.json';
const MANIFEST_ASSET_NAME = 'manifest.js';
const VENDOR_ASSET_NAME = 'vendors~main.js';
const MAIN_CHUNK_NAME = 'main.js';

class Html extends PureComponent {
  render() {
    const DEV = process.env.NODE_ENV === 'development';
    const PROD = !DEV;
    const { seo = {}, store = {}, url = '/', context = {} } = this.props;

    const state = store.getState();

    const initialState = `window.__PRELOADED_STATE__ = ${JSON.stringify(
      state,
    )}`;

    const scrollToTopOnPageLoad =
      'window.onbeforeunload=function(){window.scrollTo(0, 0);}';

    const modules = [];
    let root = '';
    try {
      root = renderStylesToString(
        renderToString(
          <Provider store={store}>
            <ThemeProvider theme={themeObject}>
              <Loadable.Capture report={moduleName => modules.push(moduleName)}>
                <StaticRouter location={url} context={context}>
                  {renderRoutes(routes)}
                </StaticRouter>
              </Loadable.Capture>
            </ThemeProvider>
          </Provider>,
        ),
      );
    } catch (e) {
      root = 'Error while rendering in server side!';
      /* eslint-disable no-console */
      console.log(e);
    }

    const reactLoadableBundleList = [];
    let stats = null;
    let assetsManifest = null;
    let fontCss = null;
    let manifestJs = null;
    let vendorJs = null;
    let mainJs = null;

    if (PROD) {
      try {
        /* eslint-disable-next-line global-require */
        stats = require(path.join(process.cwd(), REACT_LOADABLE_JSON_PATH));
      } catch (error) {
        /* eslint-disable no-console */
        console.log(error);
      }

      try {
        /* eslint-disable-next-line global-require */
        assetsManifest = require(path.join(
          process.cwd(),
          ASSEST_MANIFEST_PATH,
        ));
      } catch (error) {
        /* eslint-disable no-console */
        console.log(error);
      }

      //   fontCss = assetsManifest && assetsManifest[FONT_CSS_NAME];
      manifestJs = assetsManifest && assetsManifest[MANIFEST_ASSET_NAME];
      vendorJs = assetsManifest && assetsManifest[VENDOR_ASSET_NAME];
      mainJs = assetsManifest && assetsManifest[MAIN_CHUNK_NAME];
      if (stats) {
        const reactLoadableBundles = getBundles(stats, modules);

        // Clear duplicate bundles.
        const addedFiles = [];
        reactLoadableBundles.forEach(bundle => {
          if (bundle) {
            const { file = '' } = bundle;
            if (file && addedFiles.indexOf(file) < 0) {
              reactLoadableBundleList.push(bundle);
              addedFiles.push(file);
            }
          }
        });
      }
    }

    let defaultRobotsMetaTag = (
      <meta name="robots" content="NOINDEX,NOFOLLOW" />
    );
    if (seo.title) {
      defaultRobotsMetaTag = '';
    }
    return (
      <html lang="en">
        <head>
          <meta httpEquiv="Content-Type" content="text/html; charset=utf-8" />
          <meta charSet="utf-8" />
          <meta
            name="viewport"
            content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, height=device-height"
          />
          <meta httpEquiv="X-UA-Compatible" content="IE=edge,chrome=1" />

          {/* Allow installing the app to the homescree */}
          <meta name="mobile-web-app-capable" content="yes" />

          {/* iOS home screen icons */}
          <meta name="apple-mobile-web-app-title" content="CaratLane" />
          {/* <link
            rel="apple-touch-icon"
            sizes="120x120"
            href="/icon-120x120.png"
          />
          <link
            rel="apple-touch-icon"
            sizes="152x152"
            href="/icon-152x152.png"
          />
          <link
            rel="apple-touch-icon"
            sizes="167x167"
            href="/icon-167x167.png"
          />
          <link
            rel="apple-touch-icon"
            sizes="180x180"
            href="/icon-180x180.png"
          /> */}
          {PROD ? <link rel="manifest" href="manifest.json" /> : null}
          <script
            dangerouslySetInnerHTML={{ __html: scrollToTopOnPageLoad }} // eslint-disable-line react/no-danger
          />
          <title>{seo.title ? seo.title : 'Share it'}</title>
          {seo.robots ? (
            <meta name="robots" content={seo.robots} />
          ) : (
            defaultRobotsMetaTag
          )}
          {seo.description ? (
            <meta name="description" content={seo.description} />
          ) : (
            ''
          )}
          {seo.canonical_tag ? (
            <link rel="canonical" href={seo.canonical_tag} />
          ) : (
            ''
          )}
          <link rel="icon" href="/favicon.ico" type="image/x-icon" />
          <link rel="shortcut icon" href="/favicon.ico" type="image/x-icon" />
        </head>
        <body>
          <script
            dangerouslySetInnerHTML={{ __html: initialState }} // eslint-disable-line react/no-danger
          />

          <div
            id="app"
            dangerouslySetInnerHTML={{ __html: root }} // eslint-disable-line react/no-danger
          />
          {/* {DEV ? <script src="/reactBoilerplateDeps.dll.js" /> : ''} */}
          {DEV ? <script src="/main.js" /> : ''}
          {PROD && fontCss ? <link rel="stylesheet" href={fontCss} /> : ''}
          {PROD && manifestJs ? <script src={manifestJs} /> : ''}
          {PROD && vendorJs ? <script src={vendorJs} /> : ''}
          {PROD &&
            reactLoadableBundleList.map(bundle => (
              <script key={bundle.file} src={bundle.publicPath} />
            ))}
          {PROD && mainJs ? <script src={mainJs} /> : ''}
          <div id="overlay-container" />
          <div id="pageloader-container" />
        </body>
      </html>
    );
  }
}

Html.propTypes = {
  url: PropTypes.string.isRequired,
  store: PropTypes.object.isRequired,
  context: PropTypes.object,
  seo: PropTypes.object,
};
export default Html;
