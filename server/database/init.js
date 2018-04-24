const mongoose=require('mongoose')
const db='mongodb://localhost/db'
mongoose.Promise=global.Promise

exports.connect=()=>{
    let maxConnectTimes=0
    return new Promise((resolve,reject)=>{
        if(process.env.NOVE_ENV!=='production'){
            mongoose.set('debug',true)
        }
        mongoose.connect(db) 
        mongoose.connection.on('disconnected',()=>{
            maxConnectTimes++
            if(maxConnectTimes<5){
                mongoose.connect(db)
            }else{
                throw new Error('数据库连不上啊')
            }
        })
        mongoose.connection.on('error', () => {
            if (maxConnectTimes < 5) {
                mongoose.connect(db)
            } else {
                throw new Error('数据库连不上啊')
            }
        })
        mongoose.connection.once('open', () => {
            // const Dog=mongoose.model('Dog',{name:String})
            // const dog=new Dog({name:'arfa'})
            // dog.save().then(()=>{
            //     console.log('wang')
            // })
            resolve()
            console.log('mongoDB Connected successfully!')
        })
    })
    
}