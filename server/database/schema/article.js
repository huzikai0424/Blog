const mongoose=require('mongoose')
const Schema=mongoose.Schema
const Mixed=Schema.Types.Mixed
const articleScheme=new Schema({
    id:String,
    title:String,
    des:String,
    coverPic:String,
    postDate: {
        type: Date,
        default: Date.now()
    },
    lastupdataDate: {
        type:Date,
        default:Date.now()
    },
    readTime:{
        type:Number,
        default:0
    },
    commentCount: {
        type: Number,
        default: 0
    },
    likeCount:{
        type: Number,
        default: 0
    }
})

mongoose.model('Article', articleScheme)