const webpack = require('webpack');
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

const { NODE_ENV = 'production' } = process.env;
const __DEV__ = NODE_ENV === 'development';

module.exports = {
  mode: __DEV__ ? 'development' : 'production',

  entry: {
    main: './docs/main.js'
  },

  output: {
    filename: __DEV__ ? '[name].js' : '[name].[hash].js',
    path: path.resolve(__dirname, 'dist')
  },

  devServer: {
    contentBase: './dist',
    open: true,
    port: 2323,
    hot: true,
    hotOnly: true
  },

  module: {
    rules: [
      {
        test: /\.ts$/,
        use: 'ts-loader',
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
        include: path.resolve(__dirname, 'docs')
      }
    ]
  },

  resolve: {
    alias: {
      src: path.resolve(__dirname, './src')
    },
    modules: ['node_modules'],
    extensions: ['.ts', '.js']
  },

  node: {
    fs: 'empty'
  },

  plugins: [
    new HtmlWebpackPlugin({
      template: './docs/index.html'
    }),
    new CleanWebpackPlugin(),
    new webpack.HotModuleReplacementPlugin()
  ],

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
