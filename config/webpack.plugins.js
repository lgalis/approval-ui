const path = require('path');
const webpack = require('webpack');
const config = require('./webpack.common.js');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const LodashWebpackPlugin = require('lodash-webpack-plugin');
const HtmlReplaceWebpackPlugin = require('html-replace-webpack-plugin');
const WriteFileWebpackPlugin = require('write-file-webpack-plugin');

const plugins = [
  new WriteFileWebpackPlugin(),
  new HtmlWebpackPlugin({
    title: 'Catalog for ansible',
    filename: 'index.html',
    template: path.resolve(__dirname, '../src/index.html')
  }),
  new webpack.SourceMapDevToolPlugin({
    test: /\.js/i,
    exclude: /node_modules/i,
    filename: `sourcemaps/[name].js.map`
  }),
  new LodashWebpackPlugin({
    currying: true,
    flattening: true,
    placeholders: true,
    paths: true
  }),
  new webpack.DefinePlugin({
    'process.env.BASE_PATH': JSON.stringify(process.env.BASE_PATH || '/api')
  }),
  new HtmlReplaceWebpackPlugin([
    {
      pattern: '@@env',
      replacement: config.appDeploy
    }
  ])
];

module.exports = plugins;
