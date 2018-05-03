const glob=require('glob')
const { join }=require ('path')
const fs=require('fs')
const mongoose = require('mongoose')
const mysql = require('mysql')
const connection = mysql.createConnection({
    host:'localhost',
    user:'root',
    password:'root',
    database:'blog'
})
connection.connect((err)=>{
    if(err){
        console.log("数据库连接失败",err)
        return
    }
    console.log("数据库连接成功")
});

// glob(join(__dirname,'./article',"**/*.md"),function(err,files) {
//     files.forEach((item,index)=>{
//         let type = item.match(/article\/(\S*)\//) ? item.match(/article\/(\S*)\//)[1] : "暂无分类"
//         let fileName = item.replace(/(.*\/)*([^.]+).*/ig, "$2")
//         console.log(`分类名字：${type},文件名：${fileName}`) 
        
//     })
    
//     // var data=fs.readFileSync(files[0]).toString()
//     console.log(data)
// })