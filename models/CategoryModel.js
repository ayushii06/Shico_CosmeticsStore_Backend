const mongoose = require('mongoose');

//defining the category model
const CategorySchema = new mongoose.Schema({
    name:{
        type:String,
        required:true,
    },
    description:{
        type:String,
        required:true,
    },
    products:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:'Product'
        }
    ]
})

//Export the model
module.exports = mongoose.model('Category',CategorySchema)