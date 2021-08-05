module.exports = function(content, map, meta) {
    const callback = this.async();
    const re = /\{\{([^\}.]+)\}\}/g;
    const json = {
        name: '李俊锴',
        num: 600
    }
    setTimeout(()=>{
        const res = content.replace(re, function($0, $1) {
            return json[$1] || '';
        });
        callback(null, res)
    }, 3000)
}