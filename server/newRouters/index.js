const mainRouter = require('../routes/index')
const apiRouter = require('./api')
const newRouter = require('./routers')
const compose = require('koa-compose')
const routerArray = [apiRouter,mainRouter,newRouter]
const registerRouter = () => {
	const middleware = []
	routerArray.forEach(router => {
		middleware.push(router.routes())
		middleware.push(router.allowedMethods())
	})
	return compose(middleware)
}
module.exports = registerRouter