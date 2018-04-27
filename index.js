// import { Mongoose } from 'mongoose'

const Koa=require('koa')
const mongoose = require('mongoose')
const views = require('koa-views')
const serve=require('koa-static')
const {resolve}=require('path')
const path= require('path')
const {connect,initSchemas} =require('./server/database/init')

const router = require('./server/routes/index')
const PORT=1234
const app=new Koa()
const c = require('child_process');
const main = serve(path.join(__dirname,'./static')) 

;(async()=>{
    await connect()
    initSchemas()

    // const Article = mongoose.model('Article')

    // const movies = await Article.find()
    // console.log(movies)
})()

app.use(main) //静态资源
app.use(views(resolve(__dirname,'./views'),{    //view默认模板后缀
    extension:'pug'
}))
app.use(router.routes()).use(router.allowedMethods)
app.listen(1234)
console.log("Server runing at port: " + PORT + ".");
c.exec(`start http://localhost:${PORT}`);