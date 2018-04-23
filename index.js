const Koa=require('koa')
const views=require('koa-views')
const serve=require('koa-static')
const {resolve}=require('path')
const path= require('path')
const PORT=1234
const app=new Koa()
const c = require('child_process');
const main = serve(path.join(__dirname,'./views'))
app.use(main)
app.use(views(resolve(__dirname,'./views'),{
    extension:'pug'
}))
app.use(async (ctx)=>{
    await ctx.render('index')
})
app.listen(1234)
console.log("Server runing at port: " + PORT + ".");
//c.exec(`start http://localhost:${PORT}/index.html`);