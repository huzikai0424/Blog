

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
const path = require('path')
const mysql = require('../database/mysql') 
const mail = require('../routes/mail')
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
        let ptotal = res[1][1] ? res[1][1].count:0
        
        let data = {
            commentList : res[0],
            total:res[1][0].count,
            ptotal: ptotal
        }
        return data
    })
    let pidArr = []
    commentList.commentList.forEach((item, index, arr) => {
        pidArr.push(item.id)
    })
    let arr = pidArr.join(',')
    let pidComment=[]
    if(arr){
        pidComment = await mysql.getChildCommentList(arr)
    }
    let sideBarData = await axios.get(`http://localhost:1234/getSidebarInfo`)
    if (sideBarData.statusText == "OK")
        sideBarData = sideBarData.data

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
        id: id,
        pidComment: pidComment ? JSON.stringify(pidComment):[],
        isLogin:ctx.session.user?true:false,
        sideBarData: sideBarData,
        url:ctx.href,
        blogName: config.themeOptions.nickname
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
    const mailData = ctx.request.body.mailData
    const id = ctx.request.body.id
    const replyId = ctx.request.body.replyId ? ctx.request.body.replyId:0
    let data = [id, replyId ,postData.nickname, postData.email, postData.website, userAgent, postData.comment, postData.qq]
    let mailObject = {
        blogName:config.themeOptions.nickname,
        replyNickNameTo: mailData.replyNiceName,
        articleTitle: mailData.title,
        oldComment: mailData.detail,
        newreplyNickName: postData.nickname,
        newComment: postData.comment,
        articleUrl: mailData.url
    }
    let newCommentObject = {
        blogName: config.themeOptions.nickname,
        articleTitle: mailData.title,
        ip:ctx.ip,
        website: postData.website,
        email: postData.email,
        comment: postData.comment,
        articleUrl: mailData.url
    }
    let html = replyId ? mail.initReplyHtml(mailObject) : mail.initCommmentHtml(newCommentObject)

    let mailTo = {
        to: replyId ? mailData.to : config.contact.email,
        subject: replyId ? `您在 [${mailData.blogName}] 的留言有了回复` : `您的文章 《${mailData.title}》 有新留言`,
        html:html
    }
    
    mail.mailOptions = Object.assign(mail.mailOptions, mailTo)
    mail.sendMail()
    let res = await mysql.submitComment(data)
    ctx.body = res
})
router.get('/getCommentList/:id',async(ctx)=>{
    const id = ctx.params.id
    const page = ctx.query.page ? ctx.query.page : 1
    const pageSize = ctx.query.pageSize ? ctx.query.pageSize : config.comment.pageSize
    const pageIndex = (page - 1) * pageSize
    let res = await mysql.getCommentListById(id, pageIndex, pageSize)
    let pidArr = []
    res[0].forEach((item,index,arr)=>{
        pidArr.push(item.id)
    })
    let arr = pidArr.join(',')
    let pidComment = ""
    if(arr){
        pidComment = await mysql.getChildCommentList(arr)
    }
    let data = {
        data:res[0],
        page:page,
        pageSize:pageSize,
        total:res[1][0].total,
        ptotal:res[1][1].total,
        pidComment: pidComment
    }
    ctx.body = data
})

router.get('/userAgent',(ctx)=>{
    let userAgent = ctx.req.headers['user-agent']
    ctx.body = userAgent
})

// router.get('/update', async(ctx) => {
//     let startTime = new Date().getTime()
//     let postListMeta = await new Promise((resolve, reject) => {
//         glob(join(__dirname, '../../article', "**/*.md"), function (err, files) {
//             let postListMeta = []
//             let tags = []
//             files.forEach((item, index) => {
//                 let meta = fm(fs.readFileSync(item).toString())
//                 let html = ""
//                 meta.attributes.tags.split("/").forEach((item, index) => {
//                     if (tags.indexOf(item) == -1 && item) {
//                         tags.push(item)
//                     }
//                 })
//                 if (meta.body.split("<!--more-->").length < 2) { //没有more标签
//                     html = commonJs.delHtmlTag(marked(meta.body)).substr(0, 130)   //截取去除html标签后的180字
//                 } else {
//                     let data = meta.body.split("<!--more-->")[0]
//                     html = commonJs.delHtmlTag(marked(data))                     //截取move标签之前的全部
//                 }
//                 if (JSON.stringify(meta.attributes) != "{}") {
//                     //meta.attributes.tags = tags
//                     meta.attributes.profile = html
//                     postListMeta.push(meta)
//                 }
//             })
//             resolve(postListMeta)
//         })
//     })
    
//     const sort = ctx.query.sort == "asc" ? "asc" : "desc" // 1升序,-1降序
//     let arr=[]
//     postListMeta.forEach((item,index)=>{
//         let attributes = item.attributes
//         let timeStamp = Date.parse(attributes.date)
//         let body = item.body
//         let arrFormat = [
//             attributes.title,
//             attributes.profile,
//             body,
//             attributes.tags,
//             timeStamp
//         ]
//         arr.push(arrFormat)
//     })
//     // ctx.body=arr
//     // console.log(arr)
//     let res = await mysql.addArticle([arr])
//     ctx.body = res 
// })

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
router.get('/deleteArticleById/:id',async(ctx)=>{
    if (!ctx.session.user){
        ctx.response.status=403
        return
    }
    //let id = ctx.query.id
    let id = ctx.params.id
    let fileName = `${ctx.query.title}.md`
    
    if(id){
        let res = await mysql.deleteArticleById(id)
        if(res.affectedRows){
            let url = path.join(__dirname, "../../article", fileName)
            fs.unlink(path.join(__dirname, "../../article", fileName),(err)=>{
                if(err)
                console.log(err)
            })
            ctx.body={
                success:true
            }
        }
    }else{
        ctx.body = {
            success:false,
            msg:"参数错误，Id为空"
        }
    }
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
    if (!ctx.session.user) {
        ctx.response.status = 403
        return
    }
    let postData = ctx.request.body.data
    let res = await mysql.deleteComments(postData)
    ctx.body = res 
})
router.post('/updateArticleById',koaBody(),async(ctx)=>{
    if (!ctx.session.user) {
        ctx.response.status = 403
        return
    }
    let postDate = ctx.request.body.data
    let { id, posts, postTime, tags, title, type, updateTime,views} = postDate
    let arr = [title,posts,type,views,tags,postTime,updateTime]
    let res = await mysql.updateArticleById(id, arr)
    ctx.body = res
})
router.post('/postArticle',koaBody(),async(ctx)=>{
    if (!ctx.session.user) {
        ctx.response.status = 403
        return
    }
    let postDate = ctx.request.body.data
    let { posts, postTime, tags, title, type, views, oldPath, newPath} = postDate
    let html = ""
    
    if (posts.split("<!--more-->").length < 2) { //没有more标签
        html = commonJs.delHtmlTag(marked(posts)).substr(0, 130)   //截取去除html标签后的180字
    } else {
        let data = posts.split("<!--more-->")[0]
        html = commonJs.delHtmlTag(marked(data))                     //截取move标签之前的全部
    }
    let arr = [title, html, posts, type, Number(views), tags, postTime]
    let res = await mysql.postArticle(arr)
    if (res.affectedRows){
        fs.rename(oldPath, newPath, (err) => {
            if (err)
                console.log(err)
        })
    }
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
        await ctx.redirect("/login")
        return;
    }
    await ctx.render('admin/index',{
        session:ctx.session
    })
})
router.get('/admin/*',async(ctx)=>{
    if (!ctx.session.user) {
        await ctx.redirect("/login")
        return;
    }
    await ctx.render('admin/index', {
        session: ctx.session
    })
})
router.get('/login',async(ctx)=>{
    await ctx.render('admin')
})
router.get("/logout",async(ctx)=>{
    if (!ctx.session.user) {
        ctx.response.status = 403
        return
    }
    ctx.session = null
    await ctx.redirect(ctx.headers.referer ? ctx.headers.referer:"login")
})
// router.get('*', async (ctx, next) => {
//     await ctx.render('admin/index')
// })
// router.get('/login',async(ctx)=>{
//     await ctx.render("login")
// })
router.post('/resetPassword',koaBody(),async(ctx)=>{
    if (!ctx.session.user) {
        ctx.response.status = 403
        return
    }
    const { username, newpsw, oldpsw, changeUsername } = ctx.request.body.data
    let usernameChange = changeUsername ? ctx.request.body.data.usernameChange : username
    let checkAccount = await mysql.checkLogin(username, oldpsw)
    if (checkAccount[0].username==username){
        let changePsw = await mysql.resetAccount(usernameChange, newpsw)
        if (changePsw.affectedRows){
            ctx.session.user = usernameChange
                ctx.body = {
                    success: true
                }
        }else{
            ctx.body={
                success: false,
                msg: "暂无数据修改",
            }
        }
       
    }else{
        ctx.body = {
            msg:"参数非法",
            success:false
        }
    }


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
router.post('/upload',koaBody({
    multipart: true,
}),async(ctx)=>{
    if (!ctx.session.user) {
        ctx.response.status = 403
        return
    }
    let data = ctx.request.body.files.file
    let fileName = data.name
    let oldPath = path.join(data.path)
    let newPath = path.join(__dirname,"../../article",fileName)
    let suffix = fileName.split(".")   
    if (suffix[suffix.length-1]!="md"){
        ctx.body = { state: false, msg: "只能上传.md后缀的文件" }
        return;
    }
    
    if(fs.existsSync(newPath)){
        ctx.body = { state: false ,msg:"文件已存在"}
    }else{
        let pathDate = fs.readFileSync(oldPath).toString()
        let meta = fm(pathDate)
        let obj={
            state:true,
            data:meta.attributes,
            md:meta.body,
            oldPath: oldPath,
            newPath: newPath
        }
        ctx.body = obj
        // fs.rename(oldPath, newPath, (err) => {
        //     if (err)
        //         console.log(err)
        // })
    }
})
module.exports = router