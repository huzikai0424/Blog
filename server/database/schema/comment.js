const mongoose=require('mongoose')
const Schema=mongoose.Schema
const Mixed=Schema.Types.Mixed
const commentScheme=new Schema({
    pid:{
        type:String,
        default:0
    },
    nickname:String,
    email:String,
    website:String,
    ua:String,
    detail:String,
    qq:String
},{timestamps:true})

mongoose.model('Comment', commentScheme)