const Router = require('koa-router')
const mysql = require('../database/mysql')
const router = new Router()
router.prefix('/api')
const checkLogin = (ctx) => {
	if (!ctx.session.user){
		ctx.response.status = 403
		return
	}
}

/**
 * 读取配置文件
 */
router.get('/getOptions', async (ctx) => {
	let result = await mysql.getOptions()
	const defaultOptions = require('../../theme.config')
	ctx.body = result.length ? result[0].data : defaultOptions
})

/**
 * 写入配置文件
 */
router.get('/setOptions', async (ctx) => {
	try {
		let options = JSON.stringify(require('../../theme.config'))
		let updateOptions = await mysql.updateOptions(options)
		if (updateOptions.affectedRows) {
			ctx.body = 'ok'
		}
	} catch (error) {
		console.error(error)
		ctx.throw = error
	}
})
/**
 * 获得侧边栏数据
 */
router.get('/getSidebarInfo',async(ctx)=>{
	let res = await mysql.getSidebarInfo()
	let tags = []
	res[1].forEach((item)=>{
		item.tags.split('/').forEach((item)=>{
			if (tags.indexOf(item) == -1){
				tags.push(item)
			}
		})
	})
	let data = {
		totalArticle:res[0][0].total,
		totalComment:res[0][1].total,
		tags: tags,
	}
	ctx.body = data
})
/**
 * 获得所有分类
 */
router.get('/getAllTags', async (ctx) => {
	let res = await mysql.getAllTags()
	let arr = []
	res.forEach((item) => {
		item.tags.split('/').forEach((tags) => {
			if (!arr.includes(tags)) {
				arr.push(tags)
			}
		})
	})
	ctx.body = arr
})
/**
 * 获得所有分类
 */
router.get('/getAllTypes', async (ctx) => {
	let res = await mysql.getAllTypes()
	let type = []
	res.forEach((item) => {
		if (item.type && !type.includes(item.type)) {
			type.push(item.type)
		}
	})
	ctx.body = type
})
/**
 * 获得文章列表
 */
router.get('/getArticleList',async(ctx)=>{
	const page = ctx.request.query.page ? ctx.request.query.page : 1
	const pageSize = ctx.request.query.pageSize ? ctx.request.query.pageSize : 10
	const start = (page - 1) * pageSize
	const res = await mysql.getArticleList('postTime', 'desc', start, pageSize)
	const obj = {
		data:res[0],
		total:res[1][0].total
	}
	ctx.body = obj
})

module.exports = router