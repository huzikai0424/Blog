

const Router = require('koa-router')
const koaBody = require('koa-body')
const router= new Router()
const marked = require('marked')
const fs = require('fs')
//const mysql = require('mysql')
const fm = require("front-matter")
const glob = require('glob')
const { join } = require('path')
const config = require('../../theme.config')
const axios = require('axios')
const commonJs = require('./common')

const mysql = require('../database/mysql') 

router.get('/', async (ctx) => {
    let startTime = new Date().getTime()
    const desc = config.article.desc ? "desc" : "asc"
    const orderBy = config.article.orderBy
    const pageSize = config.article.pageSize
    let res = await mysql.getArticleList(orderBy, desc, 0, pageSize)
    let tagsArr = []
    res[0].forEach((item) => {
        item.postTime = commonJs.formatTime(item.postTime)
    })
    //commentCount：评论数量
    let commentCountInfo = await mysql.getCommentCount()
    //侧边栏数据信息
    let sideBarData = await axios.get(`http://localhost:1234/getSidebarInfo`)
    if (sideBarData.statusText == "OK")
        sideBarData = sideBarData.data
    await ctx.render('index', {
        res: res[0],
        config: config,
        tags: tagsArr,
        loadTime: new Date().getTime() - startTime,
        commentCountInfo: commentCountInfo,
        sideBarData: sideBarData
    })
}) 

router.get('/article/:id', async(ctx) => {
    let startTime = new Date().getTime()
    const id = Number(ctx.params.id)
    let articleDate = await mysql.getArticleById(id).then(async res=>{
        nextArtilce = await mysql.getArticleNext(res[0][0].postTime)
        res[0][0].postTime = commonJs.formatTime(res[0][0].postTime)
        let data = {
            data:res[0][0],
            preArticle: nextArtilce[0]? nextArtilce[0][0]:"",
            nextArtilce: nextArtilce[1] ? nextArtilce[1][0]:""
        }
        return data
    })
    let commentList =  await mysql.getCommentListById(id).then(res=>{
        let data = {
            commentList : res[0],
            total:res[1][0].total
        }
        return data
    })
    const posts = marked(articleDate.data.posts)
    mysql.pvAddOne(id) //pv+1
    await ctx.render('article', {
        markdown: posts,
        comments: commentList,
        pageSize:config.article.pageSize,
        data: articleDate.data,
        config: config,
        loadTime: new Date().getTime() - startTime,
        nextArtilce: articleDate.nextArtilce,
        preArticle: articleDate.preArticle,
        id: id
    })
})
router.get('/getArticleList',async(ctx)=>{
    const page = ctx.request.query.page ? ctx.request.query.page:1
    const desc = config.article.desc ? "desc" : "asc"
    const orderBy = config.article.orderBy
    const pageSize = ctx.request.query.pageSize ? ctx.request.query.pageSize:config.article.pageSize
    const start = (page-1)*pageSize
    let res = await mysql.getArticleList(orderBy, desc, start, pageSize)
    let obj={
        data:res[0],
        total:res[1][0].total
    }
    ctx.body = obj
})
router.post('/submitComment', koaBody(), async(ctx)=>{
    const userAgent = ctx.req.headers['user-agent']
    const postData=ctx.request.body.data
    const id = ctx.request.body.id
    let data = [id, postData.nickname, postData.email, postData.website, userAgent, postData.comment, postData.qq]
    let res = await mysql.submitComment(data)
    console.log(res)
    ctx.body = res
})
router.get('/getCommentList/:id',async(ctx)=>{
    const id = ctx.params.id
    const page = ctx.query.page ? ctx.query.page : 1
    const pageSize = ctx.query.pageSize ? ctx.query.pageSize : config.comment.pageSize
    const pageIndex = (page - 1) * pageSize
    let res = await mysql.getCommentListById(id, pageIndex, pageSize)
    let data = {
        data:res[0],
        page:page,
        pageSize:pageSize,
        total:res[1][0].total
    }
    ctx.body = data
})

router.get('/userAgent',(ctx)=>{
    let userAgent = ctx.req.headers['user-agent']
    ctx.body = userAgent
})

router.get('/update', async(ctx) => {
    let startTime = new Date().getTime()
    let postListMeta = await new Promise((resolve, reject) => {
        glob(join(__dirname, '../../article', "**/*.md"), function (err, files) {
            let postListMeta = []
            let tags = []
            files.forEach((item, index) => {
                let meta = fm(fs.readFileSync(item).toString())
                let html = ""
                meta.attributes.tags.split("/").forEach((item, index) => {
                    if (tags.indexOf(item) == -1 && item) {
                        tags.push(item)
                    }
                })
                if (meta.body.split("<!--more-->").length < 2) { //没有more标签
                    html = commonJs.delHtmlTag(marked(meta.body)).substr(0, 130)   //截取去除html标签后的180字
                } else {
                    let data = meta.body.split("<!--more-->")[0]
                    html = commonJs.delHtmlTag(marked(data))                     //截取move标签之前的全部
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
    
    const sort = ctx.query.sort == "asc" ? "asc" : "desc" // 1升序,-1降序
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
    // ctx.body=arr
    // console.log(arr)
    let res = await mysql.addArticle([arr])
    ctx.body = res 
})

router.get('/tags/:tags', async (ctx) => {
    let tags = ctx.params.tags
    let res = await mysql.getTagsArtielc(tags)
    res.forEach((item, index) => {
        item.postTime = commonJs.formatTime(item.postTime)
    })

    
    let commentCountInfo = await mysql.getCommentCount()
    let sideBarData = await axios.get(`http://localhost:1234/getSidebarInfo`)
    if (sideBarData.statusText == "OK")
        sideBarData = sideBarData.data

    

    await ctx.render('tags',{
        res:res,
        commentCountInfo: commentCountInfo,
        tagsName:tags,
        config: config,
        sideBarData: sideBarData
    })
})

router.get('/getSidebarInfo',async(ctx)=>{
    let res = await mysql.getSidebarInfo()
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
    let res = await mysql.getSearchData()
    res.forEach((item, index) => {
        item.postTime = commonJs.formatTime(item.postTime)
    })

    
    let commentCountInfo = await mysql.getCommentCount()

    let sideBarData = await axios.get(`http://localhost:1234/getSidebarInfo`)
    if (sideBarData.statusText == "OK")
        sideBarData = sideBarData.data



    await ctx.render('search', {
        res: res,
        commentCountInfo: commentCountInfo,
        searchName: search,
        config: config,
        sideBarData: sideBarData
    })
})
router.get('/getCommentList',async(ctx)=>{
    let page = ctx.query.page ? ctx.query.page:1
    let pageSize = ctx.query.pageSize ? ctx.query.pageSize :10
    let res = await mysql.getCommentList(page,pageSize)
    let obj = {
        data:res[0],
        page:page,
        pageSize:pageSize,
        total:res[1][0].total
    }
    ctx.body = obj
    
})
router.post('/deleteComments', koaBody(),async(ctx)=>{
    let postData = ctx.request.body.data
    let res = await mysql.deleteComments(postData)
    ctx.body = res 
})
router.post('/updateArticleById',koaBody(),async(ctx)=>{
    let postDate = ctx.request.body.data
    let { id, posts, postTime, tags, title, type, updateTime,views} = postDate
    let arr = [title,posts,type,views,tags,postTime,updateTime]
    let res = await mysql.updateArticleById(id, arr)
    ctx.body = res
})
router.get('/getArticle/:id',async(ctx)=>{
    let id = ctx.params.id
    let res = await mysql.getArticleById(id)
    res[0][0].commentCount = res[1][0].commentCount
    ctx.body= res[0][0]
})
// router.post('/update')
router.get('/admin', async (ctx) => {
    if (!ctx.session.user){
        await ctx.redirect("login")
        return;
    }
    await ctx.render('admin/index')
})
router.get('/admin/*',async(ctx)=>{
    await ctx.render('admin/index')
})
router.get('/login',async(ctx)=>{
    await ctx.render('admin')
})
router.get("/logout",async(ctx)=>{
    ctx.session = null
    await ctx.redirect("login")
})
// router.get('*', async (ctx, next) => {
//     await ctx.render('admin/index')
// })
router.get('/login',async(ctx)=>{
    await ctx.render("login")
})
router.post('/checkLogin', koaBody(),async(ctx)=>{
    let {username,password} = ctx.request.body
    let res = await mysql.checkLogin(username,password)
    if(!res.length){
        ctx.body = false
        return
    }
    if (res[0].username === username){
        ctx.session.user=username
        ctx.body = true
    }
})
module.exports = router