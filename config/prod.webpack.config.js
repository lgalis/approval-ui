const merge = require('lodash').merge;
const webpackConfig = require('./base.webpack.config');
const plugins = require('./base.webpack.plugins.js');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer')
.BundleAnalyzerPlugin;

module.exports = function(env) {
  if (env && env.analyze === 'true') {
    plugins.plugins.push(new BundleAnalyzerPlugin());
  }

  return merge({},
    webpackConfig,
    plugins
  );
};
