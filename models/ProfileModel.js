const mongoose = require('mongoose'); 

var profileSchema = new mongoose.Schema({
    age:{
        type:Number,
    },
    dob:{
        type:Date,
    },
    gender:{
        type:String,
    },
    address:{
        type:String,
    }

});

//Export the model
module.exports = mongoose.model('Profile', profileSchema);