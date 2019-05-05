const path = require('path');

module.exports = {
  mode: 'production',
  entry: {
    'mini-react-hooks': path.join(__dirname, 'src', 'index.ts')
  },

  output: {
    path: path.join(__dirname, '/dist'),
    filename: '[name].js',
    libraryTarget: 'umd'
  },

  module: {
    rules: [{ test: /\.ts$/, loader: 'ts-loader' }]
  },

  resolve: {
    extensions: ['.ts']
  },

  plugins: []
};
