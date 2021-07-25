const { resolve } = require('path');
const webpack = require('webpack');
const VueLoaderPlugin = require('vue-loader/lib/plugin');
const MinCssExtractPlugin = require('mini-css-extract-plugin');
const OptimizeCssAssetsWebpackPlugin = require('optimize-css-assets-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const TerserWebpackPlugin = require('terser-webpack-plugin');
module.exports = {
  mode: 'production',
  devtool: 'source-map',
  entry: './src/main.js',
  output: {
    path: resolve(__dirname, 'dist'),
    filename: '[name].[contenthash:10].js'
  },
  module: {
    rules: [
      {
        test: /\.vue$/,
        loader: 'vue-loader'
      },
      {
        oneOf: [
          {
            test: /\.(css|scss)$/,
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
              },
              'sass-loader'
            ]
          },
          {
            test: /\.js$/,
            exclude: /node_modules/,
            loader: 'babel-loader',
            options: {
              babelrc: false,
              cacheDirectory: true,
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
            test: /\.(png|jpg|gif|svg)$/,
            use: [{
              loader: 'url-loader',
              options: {
                limit: 8192,
                name: '[name].[ext]?[hash]',
                outputPath: 'image'
              }
            }]
          },
          {
            test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
            loader: 'url-loader',
            options: {
              outputPath: 'font'
            }
          }
        ]
      }
    ]
  },
  plugins: [
    new CleanWebpackPlugin(['dist/']),
    new HtmlWebpackPlugin({
      template: resolve(__dirname, './src/index.html'),
      filename: 'index.html',
      excludeChunks: /null/,  // 指定某个chunk文件不插入，chunks参数则指定要插入的chunk
      // chunksSortMode: 'dependency' 根据多个chunk的依赖关系排序插入顺序
      minify: false   // 不压缩
    }),
    new MinCssExtractPlugin({
      filename: '[name].[contenthash:10].css',
      chunkFilename: '[name].[chunkhash:10].css'
    }),
    new VueLoaderPlugin(),
    new OptimizeCssAssetsWebpackPlugin({
      assetNameRegExp: /\.css$/g, // 匹配文件规则
      cssProcessorOptions: {  // cssProcessor的参数，cssProcessor默认为cssnano
        discardComments: {    // 去除注释
          removeAll: true
        },
        autoprefixer: false,    // 因为loader已经做了兼容性处理，这里就不需要了
        safe: true    // 避免 cssnano 重新计算 z-index
      },
      canPrint: true  // 能够在console中打印信息
    }),
    // new webpack.DllReferencePlugin({
    //   context: __dirname,
    //   manifest: resolve(__dirname, 'dll/mainfest.json')
    // })
  ],
  optimization: {
    splitChunks: {
      cacheGroups: {
        vendor: {
          name: 'name',
          filename: 'vendor~[contenthash:8].js',
          chunks: 'initial',
          test: /[\\/]node_modules[\\/].+\.js$/,
          reuseExistingChunk: true, // 复用模块
          priority: -10
        },
        'vue': {
          test: /vue/,
          filename: 'vue~[contenthash:8].js',
          chunks: 'initial',
          reuseExistingChunk: true,
          priority: 1
        },
        'element': {
          test: /element\-ui/,
          filename: 'element~[contenthash:8].js',
          chunks: 'initial',
          reuseExistingChunk: true,
          priority: 2
        }
      }
    },
    minimizer: [
      new TerserWebpackPlugin({
        cache: true,
        parallel: true,
        extractComments: false,
        sourceMap: true
      })
    ]
  }
}