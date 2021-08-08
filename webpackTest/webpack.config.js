const path = require('path');
const ClearWebpackPlugin = require('./plugins/clearWebpackPlugin')
const CopyWebpackPlugin = require('./plugins/copyWebpackPlugin')
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
    new ClearWebpackPlugin(),
    new CopyWebpackPlugin({
      from: 'public',
      to: 'css'
    })
  ],
  resolveLoader: {
    modules: [
      'node_modules',
      path.resolve(__dirname, 'loaders')
    ]
  }
}