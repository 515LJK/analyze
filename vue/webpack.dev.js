const { resolve } = require('path');
const MinCssExtractPlugin = require('mini-css-extract-plugin');
const OptimizeCssAssetsWebpackPlugin = require('optimize-css-assets-webpack-plugin')

module.exports = {
  entry: '../src/main.js',
  output: {
    path: resolve(__dirname, './dist'),
    name: '[name].[contenthash:10].js'
  },
  module: {
    rules: [
      {
        test: /\.vue$/,
        loader: 'vue-loader'
      },
      {
        test: /\.css$/,
        use: [
          MinCssExtractPlugin.loader, 
          'css-loader',
          {
            loader: 'postcss-loader',
            options: {
              ident: 'postcss',
              plguins: ()=>[
                require('postcss-preset-env')({
                  browsers: ['> 1%', 'last 5 versions', 'Firefox >= 20', 'iOS >= 7','safari >= 6']
                })
              ]
            }
          }
        ]
      },
      {
        test: /\.scss$/,
        use: [
          minCssExtractPlugin.loader, 
          'css-loader',
          'sass-loader',
          {
            loader: 'postcss-loader',
            options: {
              ident: 'postcss',
              plguins: ()=>[
                require('postcss-preset-env')({
                  browsers: ['> 1%', 'last 5 versions', 'Firefox >= 20', 'iOS >= 7','safari >= 6']
                })
              ]
            }
          }
        ]
      },
      {
				test: /\.js$/,
				exclude: /node_modules/,
				loader: 'babel-loader',
				options: {
					babelrc: false,
					presets: [
						[
							'@babel/preset-env',
							{
								useBuiltIns: 'usage',
								corejs: '3',
								targets: {
									ie: 9,
									chrome: 37,
									ios: 8,
									android: 6
								}
							}
						]
					],
					plugins: [
						'@babel/plugin-proposal-class-properties',
						'@babel/plugin-proposal-nullish-coalescing-operator',
						'@babel/plugin-proposal-optional-chaining',
					]
				}
			},
    ]
  },
  plugins: [
    new MinCssExtractPlugin({
      filename: '[name].[contenthash:10].css',
      chunkFilename: '[name].[chunkhash:10].css'
    }),
    new OptimizeCssAssetsWebpackPlugin()
  ]
}