const mongoose=require('mongoose')
const Schema=mongoose.Schema
const Mixed=Schema.Types.Mixed
const CounterSchema  = new Schema({
    _id: {
        type: String,
        required: true
    },
    seq: {
        type: Number,
        default: 0
    }
})
const counter = mongoose.model('counter', CounterSchema);
const commentScheme=new Schema({
    _id:{
        type:String
    },
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

commentScheme.pre("save",function(next){
    var doc = this;
    counter.findByIdAndUpdate({ _id: 'article' }, { $inc: { seq: 1 } }, { new: true, upsert: true }).then(function (count) {
        console.log("...count: " + JSON.stringify(count));
        doc._id = count.seq;
        next();
    })
        .catch(function (error) {
            console.error("counter error-> : " + error);
            throw error;
        });
})

mongoose.model('Comment', commentScheme)