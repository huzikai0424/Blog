const Router = require('koa-router')
const mongoose = require('mongoose')
const koaBody = require('koa-body')
const router= new Router()
const marked = require('marked')
const fs = require('fs')
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
    const timesteamp=new Date().getTime()
    const Comment = mongoose.model('Comment')
    let data=new Comment({
        pid:0,
        nickname: postData.nickname,
        email: postData.email,
        website: postData.website,
        time: timesteamp,
        ua: userAgent,
        detail: postData.comment,
        qq:""
    })
    await data.save().then(() => {
        ctx.body={
            success:true
        }
    }).catch((err)=>{
        ctx.body={
            success:false,
            err:err
        }
    })
})
router.get('/getCommentList',async(ctx)=>{
    const Comment = mongoose.model('Comment')
    await Comment.find({}).then((data)=>{
        ctx.body=data
    })
})
router.get('/userAgent',(ctx)=>{
    let userAgent = ctx.req.headers['user-agent']
    ctx.body = userAgent
})
module.exports = router