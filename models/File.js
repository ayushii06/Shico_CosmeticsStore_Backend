const mongoose = require('mongoose');

//defining the file model
const fileSchema = mongoose.Schema({
    path:{
        type:String,
        required:true
    },
    email:{
        type:String,
    },
    
})

//Export the model
module.exports = mongoose.model('File', fileSchema);