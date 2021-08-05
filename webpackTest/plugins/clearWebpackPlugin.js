class ClearWebpackPlugin {
	constructor(path) {
		this.path = path;
	}
  apply(complier) {
    complier.hooks.emit.tap('ClearWebpackPlugin', compilation=>{
      console.log('emit')
    })
  }
}

module.exports = ClearWebpackPlugin