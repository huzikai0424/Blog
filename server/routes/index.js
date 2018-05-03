

const Router = require('koa-router')
const koaBody = require('koa-body')
const router= new Router()
const marked = require('marked')
const fs = require('fs')
const mysql = require('mysql')
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'blog'
})
connection.connect((err) => {
    if (err) {
        console.log("数据库连接失败", err)
        return
    }
    console.log("数据库连接成功")
});
const { connect, initSchemas } = require('../database/init')
router.get('/article', async (ctx) => {
    let data = marked(fs.readFileSync('./article/README.md').toString())
    await ctx.render('article', {
        markdown: data
    })
})

router.get('/', async (ctx) => {
    await ctx.render('index')
}) 

router.post('/submitComment', koaBody(), async(ctx)=>{
    const userAgent = ctx.req.headers['user-agent']
    const postData=ctx.request.body.data
    let addSQL ='insert into comments(pid,nickname,email,website,ua,detail,qq,timestamp) values (0,?,?,?,?,?,?,NOW())';
    let data = [postData.nickname, postData.email, postData.website, userAgent, postData.comment,postData.qq]
    return new Promise((resolve, reject) => {
        connection.query(addSQL, data,function (err,result) {
            if(err){
                reject(
                    ctx.body = {
                    success: false,
                    err: err
                })
                return;
            }
            resolve(ctx.body = {
                success: true
            })
        })
    })
})
router.get('/getCommentList',(ctx)=>{
    
    const sort = ctx.query.sort == "asc" ? "asc":"desc" // 1升序,-1降序
    let sql=`select * from comments order by timestamp ${sort}`;
    return new Promise((resolve,reject)=>{
        connection.query(sql,(err,result)=>{
            if (err) {
                reject(err)
                return
            }
            resolve(ctx.body = result)
        })
    })
})

router.get('/userAgent',(ctx)=>{
    let userAgent = ctx.req.headers['user-agent']
    ctx.body = userAgent
})
module.exports = router