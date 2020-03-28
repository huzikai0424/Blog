const Router = require('koa-router')
const router = new Router()
const config = require('../../theme.config')
const mysql = require('../database/mysql')
const commonJs = require('../routes/common')
const axios = require('axios')
/**
 * 首页
 */
router.get('/', async (ctx) => {
	const pageSize = config.article.pageSize
	let res = await mysql.getArticleList('postTime', 'desc',0, pageSize)
	let tagsArr = []
	res[0].forEach((item) => {
		item.postTime = commonJs.formatTime(item.postTime)
	})
	//commentCount：评论数量
	let commentCountInfo = await mysql.getCommentCount()
	//侧边栏数据信息
	let sideBarData = await axios.get(`${ctx.origin}/api/getSidebarInfo`)
	if (sideBarData.statusText == 'OK')
		sideBarData = sideBarData.data
	await ctx.render('index', {
		config,
		res: res[0],
		tags: tagsArr,
		commentCountInfo: commentCountInfo,
		sideBarData: sideBarData,
		pagination: {
			page: 1,
			pageSize,
			totalPage:Math.ceil(res[1][0].total / pageSize)
		}
	})
})
/**
 * 文章分页
 */
router.get('/index/:page', async (ctx) => {
	const page = Number(ctx.params.page)
	const pageSize = config.article.pageSize
	const start = (page - 1) * pageSize
	let res = await mysql.getArticleList('postTime', 'desc',start, pageSize)
	let tagsArr = []
	res[0].forEach((item) => {
		item.postTime = commonJs.formatTime(item.postTime)
	})
	//commentCount：评论数量
	let commentCountInfo = await mysql.getCommentCount()
	//侧边栏数据信息
	let sideBarData = await axios.get(`${ctx.origin}/api/getSidebarInfo`)
	if (sideBarData.statusText == 'OK')
		sideBarData = sideBarData.data
	await ctx.render('index', {
		config,
		res: res[0],
		tags: tagsArr,
		commentCountInfo: commentCountInfo,
		sideBarData: sideBarData,
		pagination: {
			page,
			pageSize,
			totalPage:Math.ceil(res[1][0].total / pageSize)
		}
	})
})
module.exports = router