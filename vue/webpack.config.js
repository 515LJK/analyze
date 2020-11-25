const webpack = require('webpack');
const VueLoaderPlugin = require('vue-loader/lib/plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const FriendlyErrorsWebpackPlugin = require('friendly-errors-webpack-plugin');
const path = require('path');

module.exports = {
    entry: './src/main.js',
    output: {
        path: path.join(__dirname,'./src'),
        filename: 'index.[hash].js'
    },
    module: {
        rules:[
            {
              test: /\.vue$/,
              loader: 'vue-loader'
            },
            {
                test:/\.(scss|css)$/,
                loader: [{
                    loader: MiniCssExtractPlugin.loader,
                    options: {
                        hmr: true
                    }
                },'css-loader', 'sass-loader', 'postcss-loader'],
                exclude: /node_modules/
            },
            {
                test: /\.(png|jpg|gif|svg)$/,
                use: [{
                    loader: 'url-loader',
                    options: {
                        limit: 8192,
                        name: '[name].[ext]?[hash]'
                    }
                }]
            },
            {
                test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
                loader: 'url-loader'
            }
        ]
    },
    devServer:{
        contentBase: path.join(__dirname,'./src'), //本地服务器加载的页面所在目录
        publicPath: '/',
        historyApiFallback: true, //不跳转,让所有的404定位到index;
        inline: true,    //实时刷新
        host: '127.0.0.1',
        quiet: true,
        port: 1314,     //端口号
        overlay: {
            errors: true
        },
        headers: {
            'Access-Control-Allow-Origin': '*'
        },
        disableHostCheck: true,
        hot: true,
        clientLogLevel: "none"
    },
    resolve: {
        extensions: ['.js', '.vue'],
        alias: {
            'common': path.join(__dirname,'./src/common'),
            'v-component': path.join(__dirname,'./src/components'),
        }
    },
    devtool: 'eval-source-map',
    plugins:[
        new MiniCssExtractPlugin({
            /* hash 的规则不要随意更改，css 分割的逻辑依据这个文件名规则来进行的！ */
            filename: `[name]~[contenthash:8].css`,
            chunkFilename: `[name]~[chunkhash:8].css`,
            allChunks: true,
            hot: true
        }),
        new HtmlWebpackPlugin({
            title: 'test',
            filename: path.join(__dirname,'./src/index.html'),
            template: path.join(__dirname,'./src/index.html'),
            inject: true,
            excludeChunks: /null/,
            minify: false
        }),
        new VueLoaderPlugin(),
        new webpack.HotModuleReplacementPlugin(),
        new FriendlyErrorsWebpackPlugin(),
        // 这个插件配置全局/共享的 loader 配置，使所有的 loader 都能收到这些配置
        new webpack.LoaderOptionsPlugin({
          minimize: false
        }),
        new webpack.NoEmitOnErrorsPlugin()
    ]
}