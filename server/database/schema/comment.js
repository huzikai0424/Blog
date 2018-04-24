const mongoose=require('mongoose')
const Schema=mongoose.Schema
const Mixed=Schema.Types.Mixed
const commentScheme=new Schema({
    id:{
        unique:true,
        type:String
    },
    pid:{
        type:String,
        default:0
    },
    nickname:String,
    email:String,
    website:String,
    time: {
        type: Date,
        default: Date.now()
    },
    ua:String,
    detail:String,
    qq:String
})

mongoose.model('Comment', commentScheme)