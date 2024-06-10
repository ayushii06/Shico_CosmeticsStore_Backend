const mongoose = require('mongoose');
const fileSchema = mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    path:{
        type:String,
        required:true
    },
    email:{
        type:String,
    },
    
})

const File = mongoose.model('File',fileSchema);
module.exports = File;