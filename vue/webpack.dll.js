const {resolve} = require('path');
const webpack = require('webpack');
module.exports = {
    entry: {
        vue: ['vue']
    },
    output: {
        filename: '[name].js',
        path: resolve(__dirname, 'dll'),
        library: '[name]_[hash]'
    },
    plugins: [
        new webpack.DllPlugin({
            context: __dirname,
            name: '[name]_[hash]',
            path: resolve(__dirname, 'dll/mainfest.json')
        })
    ],
    mode: 'production'
}