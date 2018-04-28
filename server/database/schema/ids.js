const mongoose = require('mongoose')
const Schema = mongoose.Schema
const id = new Schema({
    _id:{
        type:String,
        required:true
    },
    seq:{
        type:Number,
        default:0
    }
})

mongoose.model('Ids', id)