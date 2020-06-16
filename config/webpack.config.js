const merge = require('webpack-merge');
const path = require('path');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer')
.BundleAnalyzerPlugin;
const plugins = require('./webpack.plugins.js');
const common = require('./webpack.common.js');

const commonConfig = {
  resolve: {
    alias: {
      react: path.resolve(__dirname, '../node_modules/react')
    }
  },
  entry: {
    App: common.paths.entry
  },
  optimization: {
    splitChunks: {
      chunks: 'all',
      cacheGroups: {
        default: false,
        vendors: false,
        framework: {
          chunks: 'all',
          name: 'framework',
          test: /(?<!node_modules.*)[\\/]node_modules[\\/](react|react-dom|prop-types)[\\/]/,
          priority: 40
        },
        /**
         * Consolidate all PF assets into one chunk.
         * Witouth this, we will have multiple PF assets duplications (FormSelect was included 5x for some reason).
         * Reduces the over all build size about 2 MB but tanks the initial load a little bit (from 1.4MB -> 1.9MB).
         * That will be eliminated by asset pre caching and will reduce the overall bandwith usage. Swill worth it i think
         * PF itselfs witouth any duplications is around 1.1MB with duplications almost 3MB.
         */
        patternfly: {
          chunks: 'all',
          name: 'patternfly',
          test: /(?<!node_modules.*)[\\/]node_modules[\\/]@patternfly[\\/]/,
          priority: 40
        },
        lib: {
          priority: 30,
          minChunks: 1,
          reuseExistingChunk: true
        },
        commons: {
          name: 'commons',
          minChunks: 47,
          priority: 20
        },
        shared: {
          priority: 10,
          minChunks: 2,
          reuseExistingChunk: true
        }
      },
      maxInitialRequests: 25,
      /**
       * Smaller size will benefit from paraller asset loading and pre-caching, 244KB is recommended size
       * This also helped with some module duplication issues.
       * Now all reasobly sized modules ale properly re-used and larger ones are split into multipl chunks
       */
      maxSize: 244000,
      minSize: 20000 // no point of having smaller size
    }
  },
  output: {
    filename: 'js/[name].[contenthash].js',
    chunkFilename: 'js/[name].[contenthash].js',
    path: common.paths.public,
    publicPath: common.paths.publicPath
  },
  module: {
    rules: [
      {
        test: /src\/.*\.js$/,
        exclude: /node_modules/,
        use: [{ loader: 'source-map-loader' }, { loader: 'babel-loader' }]
      },
      {
        test: /\.s?[ac]ss$/,
        use: [ 'style-loader', 'css-loader', 'sass-loader' ]
      },
      {
        test: /\.(woff(2)?|ttf|jpg|png|eot|gif|svg)(\?v=\d+\.\d+\.\d+)?$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: '[name].[ext]',
              outputPath: 'fonts/'
            }
          }
        ]
      },
      {
        parser: {
          amd: false
        }
      }
    ]
  },
  plugins
};

const devConfig = {
  devServer: {
    contentBase: path.join(__dirname, '../dist'),
    port: 8002,
    https: true,
    historyApiFallback: true,
    hot: false,
    inline: false,
    disableHostCheck: true
  }
};

module.exports = function(env) {
  const common = commonConfig;
  if (env.analyze === 'true') {
    common.plugins.push(new BundleAnalyzerPlugin());
  }

  if (env.prod === 'true') {
    return common;
  }

  return merge(common, devConfig);
};
