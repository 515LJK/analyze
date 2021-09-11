const { override, fixBabelImports } = require('customize-cra');
const { resolve } = require('path');
module.exports = function(config, env) {
    const configs = override(
        fixBabelImports('import', {
            libraryName: 'antd',
            libraryDirectory: 'es',
            style: 'css',
        })
    )(config, env)
    return {
        ...configs,
        resolve: {
            alias: {    // 别名
                common: resolve(__dirname, 'src/common'),
                '@': resolve(__dirname),
                'r-components': resolve(__dirname, 'src/components'),
                'r-page': resolve(__dirname, 'src/page'),
                'r-redux': resolve(__dirname, 'src/redux')
            },
        }
    }
}