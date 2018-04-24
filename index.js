const Koa=require('koa')
const views=require('koa-views')
const serve=require('koa-static')
const {resolve}=require('path')
const path= require('path')
// const router = require('./routes')()
const PORT=1234
const app=new Koa()
const c = require('child_process');
const main = serve(path.join(__dirname,'./static')) 
const marked=require('marked')
const fs=require('fs')
const Router = require('koa-router')
const router = new Router()
const {connect} =require('./server/database/init')
;(async()=>{
    await connect()
})()
/*app.use(main) //静态资源

app.use(views(resolve(__dirname,'./views'),{    //view默认模板后缀
    extension:'pug'
}))
app.use(router.routes()) //路由
router.get('/article',async(ctx)=>{
    let data = marked(fs.readFileSync('./article/README.md').toString())
    await ctx.render('article', {
        markdown: data
    })
})
router.get('/', async (ctx) => {
    await ctx.render('index')
}) 
app.listen(1234)
console.log("Server runing at port: " + PORT + ".");
//c.exec(`start http://localhost:${PORT}/index.html`);*/