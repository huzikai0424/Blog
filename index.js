const Koa=require('koa')
const views = require('koa-views')
const serve=require('koa-static')
const {resolve}=require('path')
const path= require('path')
const session = require('koa-session')
//const {connect,initSchemas} =require('./server/database/init')

const router = require('./server/routes/index')
const PORT=1234
const app=new Koa()
const c = require('child_process');
const main = serve(path.join(__dirname,'./static')) 

app.use(main) //静态资源
app.use(views(resolve(__dirname,'./views'),{    //view默认模板后缀
    extension:'pug'
}))

app.keys = ['some secret hurr'];
const CONFIG = {
    key: 'koa:sess',   //cookie key (default is koa:sess)
    maxAge: 86400000,  // cookie的过期时间 maxAge in ms (default is 1 days)
    overwrite: true,  //是否可以overwrite    (默认default true)
    httpOnly: true, //cookie是否只有服务器端可以访问 httpOnly or not (default true)
    signed: true,   //签名默认true
    rolling: false,  //在每次请求时强行设置cookie，这将重置cookie过期时间（默认：false）
    renew: false,  //(boolean) renew session when session is nearly expired,
};
app.use(session(CONFIG, app));
app.use(router.routes()).use(router.allowedMethods)
app.listen(1234)
console.log(`Server runing at http://localhost:${PORT}/`)
//console.log("Server runing at port: " + PORT + ".");
//c.exec(`start http://localhost:${PORT}`);