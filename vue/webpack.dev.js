const { resolve } = require('path');
const HtmlWebpackplugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const FriendlyErrorsWebpackPlugin = require('friendly-errors-webpack-plugin');

module.exports = {
	mode: 'development',
	devtool: 'eval-source-map',
	entry: './src/main.js',
	output: {
		path: resolve(__dirname, 'dist'),
		filename: '[name].[contenthash].js'
	},
	module: {
		rules: [
			{
				test: /\.vue$/,
				loader: 'vue-loader'
			},
			{
				test: /\.css$/,
				use: ['style-loader', 'css-loader']
			},
			{
				test: /\.scss$/,
				use: ['style-loader', 'css-loader', 'sass-loader']
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
			{
				test: /\.(png|gif|jpg)$/,
				loader: 'url-loader',
				options: {
					limit: 8 * 1024,
					esModule: false,
					name: '[hash:10].[ext]',
					outputPath: 'image'
				}
			},
			{
        test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
        loader: 'url-loader'
      }
		]
	},
	plugins: [
		new HtmlWebpackplugin({
			template: resolve(__dirname, './src/index.html')
		}),
		new CleanWebpackPlugin(),
		new FriendlyErrorsWebpackPlugin()
	],
	devServer: {
		contentBase: resolve(__dirname, 'dist'),
		port: 8080,
		hot: true,
		quiet: true,
		inline: true,    //和host配合使用先尝试热更新，失败则实时刷新
		historyApiFallback: true,
		overlay: {
      errors: true
		},
		clientLogLevel: "none",
		headers: {
      'Access-Control-Allow-Origin': '*'
    }
	}
}