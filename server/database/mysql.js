const mysql = require('mysql')
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

exports.selectAll = ()=>{
    let sql = `select * from articles`
    return query(sql)
}