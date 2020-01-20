const webpack = require('webpack');
const VueLoaderPlugin = require('vue-loader/lib/plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
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
        port: 8888,     //端口号
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
    devtool: 'eval-source-map',
    plugins:[
        new HtmlWebpackPlugin({
            title: 'test',
            filename: path.join(__dirname,'./src/index.html'),
            inject: true,
            excludeChunks: /null/,
            minify: false
        }),
        new VueLoaderPlugin(),
        new FriendlyErrorsWebpackPlugin(),
        // 这个插件配置全局/共享的 loader 配置，使所有的 loader 都能收到这些配置
        new webpack.LoaderOptionsPlugin({
          minimize: false
        }),
    ]
}