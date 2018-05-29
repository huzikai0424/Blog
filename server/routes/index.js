

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
const axios = require('axios')
const connection = mysql.createPool({
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
    //let posts = ""
    function getArticle(id){
        return axios.get(`http://localhost:1234/getArticle?id=${id}`)
    }
    function getCommentList(id){
        return axios.get(`http://localhost:1234/getCommentList/${id}`)
    }
    await axios.all([getArticle(id), getCommentList(id)]).then(axios.spread(async function(article, comment){
        const data = article.data[0]
        const comments = comment.data
        const posts = marked(data.posts)
        await ctx.render('article',{
            markdown:posts,
            comments:comments,
            data:data,
            options: options
        })
    })).catch((err)=>{
        ctx.response.status = 404
        console.log(err)
    })
    // await axios.get(`http://localhost:1234/getArticle?id=${id}`).then(async(res)=>{
    //     await axios.get(`http://localhost:1234/getCommentList/${id}`)
    //     const data = res.data[0]
    //     const posts = marked(data.posts)
    //     await ctx.render('article', {
    //         markdown: posts,
    //         data: data
    //     })
    // }).catch((err)=>{
    //     ctx.response.status = 404
    //     console.log(err)
    // })
    
    
})

router.get('/', async (ctx) => {
    let startTime = new Date().getTime()
    const desc = options.article.desc ? "desc" : "asc"
    const orderBy = options.article.orderBy
    const sql = `select * from articles ORDER BY ${orderBy} ${desc} limit 0,10`

    let res = await new Promise((resolve, reject) => {
        connection.query(sql, (err, result) => {
            if (err) reject(err)
            resolve(result)
        })
    })
    let tagsArr=[]
    res.forEach((item,index)=>{
        item.tags.split("/").forEach((item,index)=>{
            if (tagsArr.indexOf(item)==-1&&item){
                tagsArr.push(item)
            }
        })
        item.postTime = formatTime(item.postTime)
    })
    function formatTime(time){
        let date = new Date(time)
        let year = date.getFullYear()
        let month = date.getMonth() + 1 < 10 ? `0${date.getMonth()+1}` : date.getMonth()+1
        let day = date.getDate()
        return `${year}年${month}月${day}日`
    }
    

    await ctx.render('index',{
        res:res,
        options: options,
        tags: tagsArr
    })
    
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
router.get('/getCommentList/:id',async(ctx)=>{
    const id = ctx.params.id
    const desc = options.comment.desc ? "desc" : "asc"
    const orderBy = options.comment.orderBy
    const sql=`select * from comments where article_id = ${id}`;
    let res = await new Promise((resolve,reject)=>{
        connection.query(sql,(err,result)=>{
            if (err) reject(err)
            resolve(result)
        })
    })
    ctx.body = res
})
router.get('/getArticle',async (ctx)=>{
    const id = ctx.query.id
    const page = ctx.query.page ? ctx.query.page:1
    const pageSize = options.article.pageSize ? options.article.pageSize:10
    const pageIndex = (page - 1) * pageSize
    const desc = options.article.desc ? "desc" : "asc"
    const orderBy = options.article.orderBy
    let sql = `select * from articles ORDER BY ${orderBy} ${desc} limit ${pageIndex},${pageSize}`
    if(id){
        sql=`select * from articles where id = ${id}`
    }
    let res = await new Promise((resolve, reject) => {
        connection.query(sql, (err, result) => {
            if (err) reject(err)
            resolve(result)
        })
    })
    ctx.body = res
})
router.get('/userAgent',(ctx)=>{
    let userAgent = ctx.req.headers['user-agent']
    ctx.body = userAgent
})

router.get('/update', async(ctx) => {
    let startTime = new Date().getTime()
    // let postListMeta = ""
    function delHtmlTag(str) {
        return str.replace(/<[^>]+>/g, "");//去掉所有的html标记
    }
    let postListMeta = await new Promise((resolve, reject) => {
        glob(join(__dirname, '../../article', "**/*.md"), function (err, files) {
            let postListMeta = []
            let tags = []
            files.forEach((item, index) => {
                let meta = fm(fs.readFileSync(item).toString())
                let html = ""
                //if(tags.indexOf())
                meta.attributes.tags.split("/").forEach((item, index) => {
                    if (tags.indexOf(item) == -1 && item) {
                        tags.push(item)
                    }
                })
                //let substr = meta.body.split("<!--more-->").length < 2 ? meta.body : meta.body.split("<!--more-->")[0]
                if (meta.body.split("<!--more-->").length < 2) { //没有more标签
                    html = delHtmlTag(marked(meta.body)).substr(0, 130)   //截取去除html标签后的180字
                } else {
                    let data = meta.body.split("<!--more-->")[0]
                    html = delHtmlTag(marked(data))                     //截取move标签之前的全部
                }
                if (JSON.stringify(meta.attributes) != "{}") {
                    //meta.attributes.tags = tags
                    meta.attributes.profile = html
                    postListMeta.push(meta)
                }
            })
            
            resolve(postListMeta)
        })
    })
    
    // await ctx.render('index', {
    //     options: options,
    //     loadTime: loadTime,
    //     postListMeta: postListMeta,
    //     tags: postListMeta[0].tags
    // })
    const sort = ctx.query.sort == "asc" ? "asc" : "desc" // 1升序,-1降序
    let addSql  = `INSERT INTO articles(title,des,posts,tags,postTime) VALUES ?`
    let arr=[]
    postListMeta.forEach((item,index)=>{
        let attributes = item.attributes
        let timeStamp = Date.parse(attributes.date)
        let body = item.body
        let arrFormat = [
            attributes.title,
            attributes.profile,
            body,
            attributes.tags,
            timeStamp
        ]
        arr.push(arrFormat)
    })
    console.log(arr)
    return new Promise((resolve, reject) => {
        connection.query(addSql, [arr],(err, result) => {
            if (err) {
                reject(err)
                return
            } 
            ctx.body = result
            resolve(result)
        })
    })
})
module.exports = router