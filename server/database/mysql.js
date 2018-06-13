const mysql = require('mysql')
const config = require('../../theme.config')

const connection = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'blog',
    multipleStatements: true
})
let query = (sql,data)=>{
    return new Promise((resolve,reject)=>{
        connection.query(sql,data, (err, result) => {
            if (err) reject(err)
            resolve(result)
        })
    })
}
/**
 * 获取文章列表
 */
exports.getArticleList = (orderBy,desc,page=0,pageSize=10)=>{
    const sql = `select * from articles ORDER BY ${orderBy} ${desc} limit ${page},${pageSize}`
    const sql2= `select count(*) as total from articles`
    let querySql = `${sql};${sql2}`
    return query(querySql)
}
/**
 * 获取某ID下的文章
 */
exports.getArticleById = (id)=>{
    const sql = `select * from articles where id = ${id}`
    const sql2 = `select count(*) as commentCount from comments where article_id = ${id}`
    const querySql = `${sql};${sql2}`
    return query(querySql)
}
/**
 * 获取评论数量
 */
exports.getCommentCount=()=>{
    const sql ="select article_id, count(*) as count from comments GROUP BY article_id"
    return query(sql)
}
/**
 * 获取侧边栏信息
 */
exports.getSidebarInfo=()=>{
    let sql = 'select count(*) as total from articles union ALL select count(*) from comments '
    let sql2 = 'select tags from articles'
    let querySql = `${sql};${sql2}`
    return query(querySql)
}

/**
 * 获取搜索的文章
 */
exports.getSearchData = (search)=>{
    let sql = `select * from articles where tags like '%${search}%' or posts like '%${search}%' or title like '%${search}%'`
    return query(sql)
}
/**
 * 获取某分类下的文章
 */
exports.getTagsArtielc = (tags)=>{
    let sql = `select * from articles where tags like '%${tags}%'`
    return query(sql)
}
/**
 * 插入或者更新文章
 */
exports.addArticle = (data)=>{
    let sql =`INSERT INTO articles(title,des,posts,tags,postTime) VALUES ? ON DUPLICATE KEY UPDATE title=?,des=?,posts=?,tags=?,postTime=?`
    return query(sql,data)
}
/**
 * 获得某文章下的评论列表和总条数
 */
exports.getCommentListById = (id, pageIndex = 0, pageSize = config.comment.pageSize, orderBy = config.comment.orderBy, desc = config.comment.desc ? "desc" : "asc")=>{
    const sql = `select * from comments where article_id = ${id} ORDER BY ${orderBy} ${desc} limit ${pageIndex},${pageSize} `;
    const sql2 = `select count(*) as total from comments where article_id = ${id}`
    const querySql = `${sql};${sql2}`
    return query(querySql)
}
/**
 * 插入评论
 */
exports.submitComment = (data)=>{
    let addsql = `insert into comments(article_id,pid,nickname,email,website,ua,detail,qq,timestamp) values (?,0,?,?,?,?,?,?,NOW())`;
    return query(addsql,data)
}
/**
 * 获取上一篇和下一篇文章信息
 */
exports.getArticleNext = (postTime)=>{
    let pre = `select id,title from articles where id = (select id from articles where postTime<${postTime} order by postTime desc limit 1)`
    let next = `select id,title from articles where id = (select id from articles where postTime>${postTime} order by postTime desc limit 1) `
    let querySql = `${pre};${next}`
    return query(querySql)
}
/**
 * Pv+1
 */
exports.pvAddOne = (id)=>{
    let sql = `update articles set views = views+1 where id = ${id}`
    return query(sql)
}
/**
 * 获取所有评论
 */
exports.getCommentList = (page = 1, pagesize = config.comment.pageSize,orderBy = config.comment.orderBy, desc = config.comment.desc?"desc":"asc")=>{
    let start = (page-1)*pagesize
    let sql = `select a.id,a.nickname,a.detail,b.title,a.website,a.email,a.\`timestamp\`,a.article_id from comments a,articles b WHERE a.article_id=b.id ORDER By timestamp desc `
    let sql2 = `select count(*) as total from comments`
    let querySql = `${sql};${sql2}`
    return query(querySql)
}
/**
 * 删除评论
 */
exports.deleteComments = (arr) => {
    let ids = arr.toString()
    let sql = `delete from comments where id in (${ids})`
    return query(sql)
}