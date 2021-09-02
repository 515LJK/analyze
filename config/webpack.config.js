const { resolve } = require('path');
const webpack = require('webpack');
const VueLoaderPlugin = require('vue-loader/lib/plugin');
const MinCssExtractPlugin = require('mini-css-extract-plugin');
const OptimizeCssAssetsWebpackPlugin = require('optimize-css-assets-webpack-plugin')
const HtmlWebpackplugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const FriendlyErrorsWebpackPlugin = require('friendly-errors-webpack-plugin');
const ProgressPlugin = require('simple-progress-webpack-plugin');
const TerserWebpackPlugin = require('terser-webpack-plugin');

const NODE_ENV = process.env.NODE_ENV;
module.exports = function(env) {
  const isEnvProduction = env === 'production';
  const isEnvDevelopment = env === 'development';
  function getStyleLoaderOptions(cssOptions, preLoader) {
    const loaders = [
      isEnvDevelopment && 'style-loader',
      isEnvProduction && MinCssExtractPlugin.loader,
      {
        loader: 'css-loader',
        options: cssOptions,
      },
      {
        loader: 'postcss-loader',
        options: {
          ident: 'postcss',
          plugins: () => [
            require('postcss-preset-env')({
              autoprefixer: {
                flexbox: 'no-2009',
              },
              stage: 3,
            }),
            // postcssNormalize(),
          ],
          sourceMap: isEnvProduction
        },
      },
    ].filter(Boolean)
  
    if (preLoader) {
      loaders.push(
        {
          loader: preLoader,
          options: {
            sourceMap: true
          }
        }
      )
    }
    return loaders;
  }

  function getEnvConfig() {
    const config = {};
    if (isEnvProduction) {
      config['optimization'] = {
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
    if (isEnvDevelopment) {
      config['devServer'] = {
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
  }

  return {
    mode: isEnvProduction ? 'production' : isEnvDevelopment && 'development',
    devtool: isEnvProduction ? 'source-map' : 'eval-source-map',
    entry: './src/main.js',
    output: {
      path: resolve(__dirname, 'dist'),
      filename: isEnvProduction ? '[name].[contenthash].js' : isEnvDevelopment && '[name].bundle.js',
      chunkFilename: isEnvProduction ? '[name].[contenthash].chunk.js' : isEnvDevelopment && '[name].bundle.js',
      globalObject: 'this'
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
              test: /\.css$/,
              use: getStyleLoaderOptions({
                importLoaders: 1,
                sourceMap: isEnvProduction
              })
            },
            {
              test: /\.scss$/,
              use: getStyleLoaderOptions({
                importLoaders: 2,
                sourceMap: isEnvProduction
              }, 'sass-loader')
            },
            {
              test: /\.(js|jsx)$/,
              include: resolve(__dirname, 'src'),
              loader: 'babel-loader',
              options: {
                babelrc: false,
                presets: [
                  [
                    '@babel/preset-env',
                    {
                      useBuiltIns: 'usage',
                      corejs: '3',
                      exclude: ['transform-typeof-symbol']
                    }
                  ],
                  [
                    '@babel/preset-react',
                    {
                      development: isEnvDevelopment,
                      useBuiltIns: true,
                    },
                  ]
                ],
                plugins: [
                  '@babel/plugin-proposal-class-properties',
                  '@babel/plugin-proposal-nullish-coalescing-operator',
                  '@babel/plugin-proposal-optional-chaining',
                ],
                cacheDirectory: true,
                cacheCompression: false,
                compact: isEnvProduction,
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
        }
      ]
    },
    plugins: [
      new CleanWebpackPlugin(),
      new VueLoaderPlugin(),
      new HtmlWebpackplugin({
        template: resolve(__dirname, './src/index.html'),
        filename: 'index.html',
        excludeChunks: /null/,  // 指定某个chunk文件不插入，chunks参数则指定要插入的chunk
        // chunksSortMode: 'dependency' 根据多个chunk的依赖关系排序插入顺序
        minify: isEnvProduction   // 不压缩
      }),
      // 显示打包进度
      new ProgressPlugin({
        format: isEnvProduction ? 'compact' : 'minimal'
      }),
      // new webpack.DllReferencePlugin({
      //   context: __dirname,
      //   manifest: resolve(__dirname, 'dll/mainfest.json')
      // })
    ].concat(isEnvProduction ? [
      new MinCssExtractPlugin({
        filename: '[name].[contenthash:10].css',
        chunkFilename: '[name].[chunkhash:10].css'
      }),
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
    ] : [new FriendlyErrorsWebpackPlugin()]),
    resolveLoader: {
      modules: ['node_modules']
    },
    resolve: {    // 解析规则
      extensions: ['.js', '.vue', '.ts', '.jsx'],  // 引入文件时可以省略后缀
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
    },
    performance: {    // 性能
      maxAssetSize: 409600  // 打包超出后警告
    },
    ...getEnvConfig()
  }
}(NODE_ENV)