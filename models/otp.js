const mongoose = require('mongoose'); // Erase if already required

// Declare the Schema of the Mongo model
var otpSchema = new mongoose.Schema({
    email:{
        type:String,
        required:true,
        unique:true,
    },
    otp:{
        type:String,
        required:true,
    },
    createdAt:{
        type:Date,
        default:Date.now,
        expires: 600,
    }
});

//Export the model
module.exports = mongoose.model('Otp', otpSchema);