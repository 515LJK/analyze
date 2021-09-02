const { resolve } = require('path');
const VueLoaderPlugin = require('vue-loader/lib/plugin');
const HtmlWebpackplugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const FriendlyErrorsWebpackPlugin = require('friendly-errors-webpack-plugin');
const ProgressPlugin = require('simple-progress-webpack-plugin');

module.exports = {
	mode: 'development',
	devtool: 'eval-source-map',
	entry: './src/main.js',
	output: {
		path: resolve(__dirname, 'dist'),
		// filename: '[name].[contenthash:10].js'
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
		new VueLoaderPlugin(),
    new FriendlyErrorsWebpackPlugin(),
    // 显示打包进度
    new ProgressPlugin({
      // format: isProduction ? 'compact' : 'minimal'
      format: 'minimal'
    }),
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
  },
  resolveLoader: {
    modules: ['node_modules']
  },
  performance: {    // 性能
    maxAssetSize: 409600  // 打包超出后警告
  },
  resolve: {    // 解析规则
    extensions: ['.js', '.vue', '.ts'],  // 引入文件时可以省略后缀
    alias: {    // 别名
      common: resolve(__dirname, 'src/common'),
      'v-component': resolve(__dirname, 'src/components'),
    },
    modules: ['node_modules'],
  },
  externals: {  // 将下列资源通过index.html引入,降低webpack包资源体积
    // 'vue': 'Vue',
  },
  stats: {    // webpack控制台输出 https://webpack.docschina.org/configuration/stats/
    hash: false,  // 编译哈希值
    version: true,  // webpack版本
    timings: true,  // 时间
    assets: false,    // 资源信息
    chunks: true,   // chunk信息
    modules: false, // 构建模块信息
    reasons: false, // 模块被引用的原因信息
    children: false,    // 子模块的信息
    source: false,  // 模块的源码
    errors: true,   // 展示错误
    errorDetails: true, // 展示错误信息
    warnings: true,   // 警告信息
    publicPath: false // 展示publicPath
  }
}