const mongoose = require('mongoose');

//defining the rating model
var ratingSchema = new mongoose.Schema({
    desc:{
        type:String,
    },
    rate:{
        type:Number,
        required:true,
        
    },
    product:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Product',
    },
    createdBy:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
    },
   
});

//exporting the model
module.exports = mongoose.model('Rating', ratingSchema);