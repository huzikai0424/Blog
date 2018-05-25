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
//     console.log(files)
//     files.forEach((item,index)=>{
//         console.log(item)
//         let type = item.match(/article\/(\S*)\//) ? item.match(/article\/(\S*)\//)[1] : "暂无分类"
//         let fileName = item.replace(/(.*\/)*([^.]+).*/ig, "$2")
//         console.log(`分类名字：${type},文件名：${fileName}`) 
        
//         const data = [fs.readFileSync(item).toString(), fileName]
        
//         let addSQL='INSERT INTO articles(posts,fileName) values(?,?)'
//         return new Promise((resolve,reject)=>{
//             connection.query(addSQL,data,function(err,result){
//                 if(err){
//                     reject(err)
//                    return
//                 }
//                 resolve(result)
//             })
//         })
//     })
// })

let data = fs.readFileSync('c:/Users/user/source/repos/blog/article/javascript/函数节流和函数防抖.md')
console.log(data)