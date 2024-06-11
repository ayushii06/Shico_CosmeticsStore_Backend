const mongoose = require('mongoose'); // Erase if already required

// Declare the Schema of the Mongo model
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

module.exports = mongoose.model('Rating', ratingSchema);