const webpack = require('webpack');
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const SentryPlugin = require('@sentry/webpack-plugin');

const VERSION = require('./package.json').version;

const { NODE_ENV = 'production' } = process.env;
const __DEV__ = NODE_ENV === 'development';

const plugins = __DEV__
  ? [
      new HtmlWebpackPlugin({
        template: './website/index.html'
      }),
      new webpack.HotModuleReplacementPlugin()
    ]
  : [
      new HtmlWebpackPlugin({
        template: './website/index.html'
      }),
      new CleanWebpackPlugin(),
      new SentryPlugin({
        release: VERSION,
        include: './docs/',
        urlPrefix: '~/',
        ignore: ['node_modules']
      })
    ];

module.exports = {
  mode: __DEV__ ? 'development' : 'production',

  entry: {
    main: './website/index.tsx'
  },

  output: {
    filename: __DEV__ ? '[name].js' : '[name].[contenthash:8].js',
    path: path.resolve(__dirname, 'docs')
  },

  devServer: {
    contentBase: './docs',
    open: true,
    port: 2323,
    inline: true,
    hot: true,
    hotOnly: true
  },

  module: {
    rules: [
      {
        test: /\.ts(x?)$/,
        use: ['babel-loader', 'ts-loader'],
        exclude: /(node_modules)/
      },
      {
        test: /\.js$/,
        use: 'babel-loader',
        exclude: /(node_modules)/
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader']
      },
      {
        test: /\.less$/,
        use: [
          'style-loader',
          'css-loader?modules&localIdentName=[local]__[hash:base64:5]',
          'postcss-loader',
          'less-loader'
        ],
        include: path.resolve(__dirname, 'website')
      }
    ]
  },

  resolve: {
    alias: {
      src: path.resolve(__dirname, './src')
    },
    modules: ['node_modules'],
    extensions: ['.js', '.tsx', '.ts']
  },

  node: {
    fs: 'empty'
  },

  plugins,

  devtool: 'cheap-source-map',

  optimization: {
    splitChunks: {
      chunks: 'all',
      minSize: 30000,
      maxSize: 249856,
      minChunks: 1,
      maxAsyncRequests: 5,
      maxInitialRequests: 3,
      automaticNameDelimiter: '~',
      name: true,
      cacheGroups: {
        vendors: {
          test: /[\\/]node_modules[\\/]/,
          priority: -10,
          filename: 'vendors.js'
        },
        default: {
          priority: -20,
          reuseExistingChunk: true,
          filename: 'common.js'
        }
      }
    }
  }
};
