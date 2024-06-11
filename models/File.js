const mongoose = require('mongoose');
const fileSchema = mongoose.Schema({
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