const name = 'copy-webpack-plugin'
const { validate } = require('schema-utils');
const globby  = require('globby');
const fs = require('fs');
const { promisify } = require('util');
const readFile = promisify(fs.readFile);
const {RawSource} = require('webpack').sources;
const path = require('path');
const fields = {
  type: "object",
  properties: {
    from: {
      type: "string"
    },
    to: {
      type: "string"
    },
    ignore: {
      type: 'array'
    }
  },
  additionalProperties: false
}


class CopyWebpackPlugin {
  constructor(options = {}) {
    validate(fields, options, {
      name
    })
    this.options = options;
  }

  apply(compiler) {
    compiler.hooks.thisCompilation.tap(name, compilation=>{
      compilation.hooks.additionalAssets.tapAsync(name, async cb=>{
        const {from, ignore} = this.options;
        const to = this.options.to || '.';
        const context = compiler.options.context;
        const absolutePath = path.isAbsolute(from) ? from : path.resolve(context, from);
        const paths = await globby(absolutePath + '/*', {
          ignore: ignore ? ignore : []
        })
        const files = await Promise.all(paths.map(async filePath=>{
          const file = await readFile(filePath);
          const name = path.basename(filePath);
          const filename = path.join(to, name);
          return {
            data: file,
            filename
          }
        }))

        const assets = files.map(file=>{
          return {
            source: new RawSource(file.data),
            filename: file.filename
          }
        })

        assets.forEach(asset=>{
          compilation.emitAsset(asset.filename, asset.source);
        })

        cb();
      })
    })
  }
}

module.exports = CopyWebpackPlugin;