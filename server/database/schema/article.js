const mongoose=require('mongoose')
const Schema=mongoose.Schema
const Mixed=Schema.Types.Mixed
const articleScheme=new Schema({
    id:String,
    title:String,
    des:String,
    coverPic:String,
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
},{ timestamps: true })

mongoose.model('Article', articleScheme)