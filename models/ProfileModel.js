const mongoose = require('mongoose'); 

//creating the profile model
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
    },
    avatar:{
        type:String,
    }

});

//Export the model
module.exports = mongoose.model('Profile', profileSchema);