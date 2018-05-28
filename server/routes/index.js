

const Router = require('koa-router')
const koaBody = require('koa-body')
const router= new Router()
const marked = require('marked')
const fs = require('fs')
const mysql = require('mysql')
const fm = require("front-matter")
const glob = require('glob')
const { join } = require('path')
const options = require('../../theme.config')
const connection  = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'blog'
})
router.get('/article', async (ctx) => {
    let data = fs.readFileSync('./article/javascript/函数节流和函数防抖.md').toString()
    let meta = fm(data)
    let content = marked(meta.body)
    console.log(meta)
    await ctx.render('article', {
        markdown: content
    })
})
router.get('/article/:id', async(ctx) => {
    const id = ctx.params.id
    const sql= `select * from articles where id = ${id}`
    return new Promise((resolve,reject)=>{
        connection.query(sql, async function (err, result){
            let meta=fm(result)
            console.log(meta)
            if (result.length) {
                let data = marked(fs.readFileSync(`article/${result[0].pathName}/${result[0].fileName}.md`).toString())
                await ctx.render('article', {
                    markdown: data,
                    title: result[0].fileName
                })
                resolve(result);
            }
            else {
                ctx.body = {
                    success: false,
                    err: err
                }
                reject(err);
            }
        })
    })
    
})

router.get('/', async (ctx) => {
    let startTime = new Date().getTime()
    // let postListMeta = ""
    function delHtmlTag(str) {
        return str.replace(/<[^>]+>/g, "");//去掉所有的html标记
    }
    let postListMeta = await new Promise((resolve,reject)=>{
        glob(join(__dirname, '../../article', "**/*.md"), function (err, files) {
            let postListMeta = []
            let tags = [] 
            files.forEach((item, index) => {
                let meta = fm(fs.readFileSync(item).toString())
                let html = ""
                //if(tags.indexOf())
                meta.attributes.tags.split("/").forEach((item,index)=>{
                    if(tags.indexOf(item)==-1&&item){
                        tags.push(item)
                    }
                })
                //let substr = meta.body.split("<!--more-->").length < 2 ? meta.body : meta.body.split("<!--more-->")[0]
                if (meta.body.split("<!--more-->").length < 2){ //没有more标签
                    html = delHtmlTag(marked(meta.body)).substr(0,130)   //截取去除html标签后的180字
                }else{
                    let data = meta.body.split("<!--more-->")[0]
                    html = delHtmlTag(marked(data))                     //截取move标签之前的全部
                }
                if (JSON.stringify(meta.attributes) != "{}"){
                    meta.attributes.tags=tags
                    meta.attributes.profile = html
                    postListMeta.push(meta.attributes)
                }
            })
            resolve(postListMeta)
        })
    })
    let loadTime = new Date().getTime() - startTime
    if(loadTime>1000){
        loadTime = `${loadTime/1000} 秒`
    }else{
        loadTime = `${loadTime}毫秒`
    }
    await ctx.render('index',{
        options: options,
        loadTime: loadTime,
        postListMeta: postListMeta,
        tags: postListMeta[0].tags
    })
    
    //let Profile = marked(meta.body.split("<!--more-->")[0])
}) 

router.post('/submitComment', koaBody(), async(ctx)=>{
    const userAgent = ctx.req.headers['user-agent']
    const postData=ctx.request.body.data
    let addSQL ='insert into comments(pid,nickname,email,website,ua,detail,qq,timestamp) values (0,?,?,?,?,?,?,NOW())';
    let data = [postData.nickname, postData.email, postData.website, userAgent, postData.comment,postData.qq]
    
    // return new Promise((resolve, reject) => {
    //     connection.query(addSQL, data,function (err,result) {
    //         if(err){
    //             reject(
    //                 ctx.body = {
    //                 success: false,
    //                 err: err
    //             })
    //             return;
    //         }
    //         resolve(ctx.body = {
    //             success: true
    //         })
    //     })
    // })
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