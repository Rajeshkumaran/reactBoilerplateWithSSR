const webpack = require('webpack');
import ssrMiddleware from './ssrMiddleware';
const webpackDevMiddleware = require('webpack-dev-middleware');
const webpackHotMiddleware = require('webpack-hot-middleware');

function createWebpackMiddleware(compiler, publicPath) {
  console.log('in devMiddleWares :', publicPath);
  return webpackDevMiddleware(compiler, {
    logLevel: 'warn',
    publicPath,
    silent: true,
    hot: true,
    serverSideRender: true,
    stats: 'minimal',
    writeToDisk: true,
  });
}

module.exports = function addDevMiddlewares(app, webpackConfig) {
  const compiler = webpack(webpackConfig);
  const middleware = createWebpackMiddleware(
    compiler,
    webpackConfig.output.publicPath,
  );

  app.use(middleware);
  app.use(
    webpackHotMiddleware(compiler, {
      log: console.log,
      reload: true,
    }),
  );

  app.get('*', ssrMiddleware);
};
