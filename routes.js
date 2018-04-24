const Router = require('koa-router')
const router = new Router()
const { index } = require("./controller")

module.exports = () =>(
    // router.get('/hello', index.sayHello),
    // router.get('/hi', index.sayHi)，
    router.get('/index',index.showIndex)
)
    
    
