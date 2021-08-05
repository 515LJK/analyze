const path = require('path');
const ClearWebpackPlugin = require('./plugins/clearWebpackPlugin')
module.exports = {
  mode: 'production',
  entry: './src/index.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].[contenthash].js'
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        loader: 'const-loader'
      }
    ]
  },
  plugins: [
    new ClearWebpackPlugin('dist')
  ],
  resolveLoader: {
    modules: [
      'node_modules',
      path.resolve(__dirname, 'loaders')
    ]
  }
}