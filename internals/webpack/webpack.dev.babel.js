/**
 * DEVELOPMENT WEBPACK CONFIGURATION
 */

const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CircularDependencyPlugin = require('circular-dependency-plugin');
import { ReactLoadablePlugin } from 'react-loadable/webpack';
import WebpackAssetsManifest from 'webpack-assets-manifest';
module.exports = require('./webpack.base.babel')({
  mode: 'development',

  // Add hot reloading in development
  entry: [
    'eventsource-polyfill',
    'react-hot-loader/patch',
    'webpack-hot-middleware/client?reload=true&path=/__webpack_hmr',
    path.join(process.cwd(), 'app/app.js'), // Start with js/app.js
  ],

  // Don't use hashes in dev mode for better performance
  output: {
    filename: '[name].js',
    chunkFilename: '[name].chunk.js',
    publicPath: '/',
  },

  optimization: {
    minimize: false,

    // splitChunks: {
    //   chunks: 'all',
    // },
  },

  // Add development plugins
  plugins: [
    new webpack.HotModuleReplacementPlugin(), // Tell webpack we want hot reloading
    new ReactLoadablePlugin({
      filename: path.resolve(process.cwd(), 'build/react-loadable.json'),
    }),
    new CircularDependencyPlugin({
      exclude: /a\.js|node_modules/, // exclude node_modules
      failOnError: false, // show a warning when there is a circular dependency
    }),
    new WebpackAssetsManifest({
      output: `${path.join(process.cwd(), 'build')}/asset-manifest.json`,
      publicPath: true,
      writeToDisk: true,
    }),
  ],

  // Emit a source map for easier debugging
  // See https://webpack.js.org/configuration/devtool/#devtool
  devtool: 'eval-source-map',
  resolve: {
    modules: ['app', 'node_modules'],
    extensions: ['.js', '.jsx', '.react.js'],
    mainFields: ['browser', 'jsnext:main', 'main'],
  },
  performance: {
    hints: false,
  },
});
