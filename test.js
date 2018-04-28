const glob=require('glob')
const { join }=require ('path')
const fs=require('fs')

glob(join(__dirname,'./article',"**/*.md"),function(err,files) {
    console.log(files)
    files.forEach((item,index)=>{
        let type = item.match(/article\/(\S*)\//) ? item.match(/article\/(\S*)\//)[1] : "暂无分类"
        let fileName = item.replace(/(.*\/)*([^.]+).*/ig, "$2")
        console.log(`分类名字：${type},文件名：${fileName}`) 
    })
    return;
    var data=fs.readFileSync(files[0]).toString()
    console.log(data)
})