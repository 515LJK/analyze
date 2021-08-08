const path = require('path');
const rimraf = require('rimraf')
const pluginName = 'clear-webpack-plugin';
const util = require('util');
class ClearWebpackPlugin {
	constructor(paths) {
    if (!paths) {
      this.paths = null;
    } else {
      this.paths = typeof paths === 'string' ? [paths] : paths;
    }
    this.root = path.dirname(module.parent.filename);
  }
  clean(outputPath) {
    const {paths, root} = this;
    if (paths === null) {
      rimraf.sync(outputPath)
      return;
    }
    paths.forEach(rmPath=>{
      const removePath = path.resolve(root, rmPath);
      rimraf.sync(removePath)
    })
  }
  apply(complier) {
    complier.hooks.emit.tapAsync(pluginName, (compilation, callback)=>{
      this.clean(complier.outputPath);
      callback();
    })
  }
}

module.exports = ClearWebpackPlugin