

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
const commonJs = require('./common')
const connection = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'blog',
    multipleStatements:true
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
    let startTime = new Date().getTime()
    const id = ctx.params.id
    const page = ctx.query.page ? ctx.query.page : 1
    const pageSize = options.article.pageSize ? options.article.pageSize : 10
    //let posts = ""
    function getArticle(id){
        return axios.get(`http://localhost:1234/getArticle?id=${id}`)
    }
    function getCommentList(id,page,pageSize){
        return axios.get(`http://localhost:1234/getCommentList/${id}?page=${page}&pageSize=${pageSize}`)
    }
    await axios.all([getArticle(id), getCommentList(id,page,pageSize)]).then(axios.spread(async function(article, comment){
        let data = article.data[0]
        let postTime = data.postTime
        data.postTime = commonJs.formatTime(postTime)
        const comments = comment.data
        
        const posts = marked(data.posts)
        let loadTime = new Date().getTime() - startTime
        let sql = `update articles set views = views+1 where id = ${id}`
        connection.query(sql, (err, result) => {
            if (err) console.log(err)
        })
        let nextArtilce = await axios.get(`http://localhost:1234/getArticleNext/${postTime}`)
        nextArtilce = nextArtilce.data
        
        await ctx.render('article',{
            markdown:posts,
            comments:comments,
            data:data,
            options: options,
            loadTime: loadTime,
            nextArtilce: nextArtilce,
            id:id
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
router.get('/getArticleNext/:postTime',async(ctx)=>{
    let postTime = ctx.params.postTime
    let pre = `select id,title from articles where id = (select id from articles where postTime<${postTime} order by postTime desc limit 1)`
    let next = `select id,title from articles where id = (select id from articles where postTime>${postTime} order by postTime desc limit 1) `
    let res = await new Promise((resolve, reject) => {
        connection.query(`${pre};${next}`, (err, result) => {
            if (err) reject(err)
            resolve(result)
        })
    })
    ctx.body = res
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
        item.postTime = commonJs.formatTime(item.postTime)
    })
    /**
     *@commentCount：评论数量
     */
    let commentSql = "select article_id, count(*) as count from comments GROUP BY  article_id"
    let commentCountInfo = await new Promise((resolve, reject) => {
        connection.query(commentSql, function (err, result) {
            if (err) reject(err)
            resolve(result)
        })
    })
    /**
     * 侧边栏数据信息
     */
    let sideBarData = await axios.get(`http://localhost:1234/getSidebarInfo`)
    if (sideBarData.statusText=="OK")
        sideBarData = sideBarData.data
    await ctx.render('index',{
        res:res,
        options: options,
        tags: tagsArr,
        loadTime: new Date().getTime() - startTime,
        commentCountInfo: commentCountInfo,
        sideBarData: sideBarData
    })
    
}) 

router.post('/submitComment', koaBody(), async(ctx)=>{
    const userAgent = ctx.req.headers['user-agent']
    const postData=ctx.request.body.data
    const id = ctx.request.body.id
    let addSQL ='insert into comments(article_id,pid,nickname,email,website,ua,detail,qq,timestamp) values (?,0,?,?,?,?,?,?,NOW())';
    let data = [id,postData.nickname, postData.email, postData.website, userAgent, postData.comment,postData.qq]
    
    let res = await new Promise((resolve, reject) => {
        connection.query(addSQL, data,function (err,result) {
            if(err) reject(err)
            resolve(result)
        })
    })
    ctx.body = res
    console.log(res)
})
router.get('/getCommentList/:id',async(ctx)=>{
    const id = ctx.params.id
    const desc = options.comment.desc ? "desc" : "asc"
    const orderBy = options.comment.orderBy
    const page = ctx.query.page ? ctx.query.page : 1
    const pageSize = options.comment.pageSize ? options.comment.pageSize : 10
    const pageIndex = (page - 1) * pageSize

    const sql = `select * from comments where article_id = ${id} ORDER BY ${orderBy} ${desc} limit ${pageIndex},${pageSize} `;
    const sql2 = `select count(*) as total from comments where article_id = ${ id }`
    let res = await new Promise((resolve,reject)=>{
        connection.query(`${sql};${sql2}`,(err,result)=>{
            if (err) reject(err)
            resolve(result)
        })
    })
    let data = {
        data:res[0],
        page:page,
        pageSize:pageSize,
        total:res[1][0].total
    }
    ctx.body = data
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

router.get('/tags/:tags', async (ctx) => {
    let tags = ctx.params.tags
    let sql = `select * from articles where tags like '%${tags}%'`
    let res = await new Promise((resolve, reject) => {
        connection.query(sql, function (err, result) {
            if (err) reject(err)
            resolve(result)
        })
    })
    res.forEach((item, index) => {
        item.postTime = commonJs.formatTime(item.postTime)
    })

    let commentSql = "select article_id, count(*) as count from comments GROUP BY  article_id"
    let commentCountInfo = await new Promise((resolve, reject) => {
        connection.query(commentSql, function (err, result) {
            if (err) reject(err)
            resolve(result)
        })
    })
    let sideBarData = await axios.get(`http://localhost:1234/getSidebarInfo`)
    if (sideBarData.statusText == "OK")
        sideBarData = sideBarData.data

    

    await ctx.render('tags',{
        res:res,
        commentCountInfo: commentCountInfo,
        tagsName:tags,
        options: options,
        sideBarData: sideBarData
    })
})

router.get('/getSidebarInfo',async(ctx)=>{
    let sql = 'select count(*) as total from articles union ALL select count(*) from comments '
    let sql2 = 'select tags from articles'
    let res = await new Promise((resolve, reject) => {
        connection.query(`${sql};${sql2}`, (err, result) => {
            if (err) reject(err)
            resolve(result)
        })
    })
    let tags=[]
    res[1].forEach((item)=>{
        item.tags.split('/').forEach((item)=>{
            if(tags.indexOf(item)==-1){
                tags.push(item)
            }
        })
    })
    let data={
        totalArticle:res[0][0].total,
        totalComment:res[0][1].total,
        tags: tags
    }
    
    ctx.body = data
})
router.get('/search/:search',async(ctx)=>{
    let search = ctx.params.search
    let sql = `select * from articles where tags like '%${search}%' or posts like '%${search}%' or title like '%${search}%'`
    let res = await new Promise((resolve, reject) => {
        connection.query(sql, function (err, result) {
            if (err) reject(err)
            resolve(result)
        })
    })
    res.forEach((item, index) => {
        item.postTime = commonJs.formatTime(item.postTime)
    })

    let commentSql = "select article_id, count(*) as count from comments GROUP BY  article_id"
    let commentCountInfo = await new Promise((resolve, reject) => {
        connection.query(commentSql, function (err, result) {
            if (err) reject(err)
            resolve(result)
        })
    })
    let sideBarData = await axios.get(`http://localhost:1234/getSidebarInfo`)
    if (sideBarData.statusText == "OK")
        sideBarData = sideBarData.data



    await ctx.render('search', {
        res: res,
        commentCountInfo: commentCountInfo,
        searchName: search,
        options: options,
        sideBarData: sideBarData
    })
})
module.exports = router