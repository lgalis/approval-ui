/* global require, module, __dirname */
/* eslint-disable space-unary-ops */

/**
 * Plugins used by webpack bundler
 */
const path = require('path');
const webpack = require('webpack');
const config = require('./webpack.common.js');
const plugins = [];

/**
 * Writes bundles to distribution folder.
 *
 * @type {var}
 */
const WriteFileWebpackPlugin = new (require('write-file-webpack-plugin'))();
plugins.push(WriteFileWebpackPlugin);

/**
 * Copys entry html to distribution folder
 *
 * @type {var}
 */
const HtmlWebpackPlugin = new (require('html-webpack-plugin'))({
  title: 'My App',
  filename: 'index.html',
  template: path.resolve(__dirname, '../src/index.html')
});
plugins.push(HtmlWebpackPlugin);

/**
 * Source maps
 * @type {var}
 */
const SourceMapsPlugin = new webpack.SourceMapDevToolPlugin({
  test: /\.js/i,
  exclude: /(node_modules|bower_components)/i,
  filename: `sourcemaps/[name].js.map`
});
plugins.push(SourceMapsPlugin);

/**
 * Selects the specific lodash functions.
 *
 * @type {var}
 */
const LodashWebpackPlugin = new (require('lodash-webpack-plugin'))({ currying: true, flattening: true, placeholders: true, paths: true });
plugins.push(LodashWebpackPlugin);

/**
 * Makes build-time env vars available to the client-side as constants
 */
const envPlugin = new webpack.DefinePlugin({
  'process.env.BASE_PATH': JSON.stringify(process.env.BASE_PATH || '/api')
});
plugins.push(envPlugin);

/**
 * Replaces any @@insights in the html files with config.appDeployment value.
 * This handles the path being either insights or insightsbeta in the esi:include.
 */
const HtmlReplaceWebpackPlugin = new(require('html-replace-webpack-plugin'))([{
  pattern: '@@env',
  replacement: config.appDeployment
}]);
plugins.push(HtmlReplaceWebpackPlugin);

// plugins.push(new(require('webpack-bundle-analyzer').BundleAnalyzerPlugin));

module.exports = { plugins };
