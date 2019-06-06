const webpack = require('webpack');
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

module.exports = {
  mode: 'production',

  entry: {
    main: './docs/main.js'
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
        use: ['style-loader', 'css-loader', 'less-loader'],
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

  output: {
    filename: '[name].js',
    path: path.resolve(__dirname, 'dist')
  }
};
