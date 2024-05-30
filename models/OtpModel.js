const mongoose = require('mongoose'); 
const { default: mailSender } = require('../utils/mailSender');

var OTPSchema = new mongoose.Schema({
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
        expires: 2*60,
    }
});

OTPSchema.pre('save',async function(next){
    try{
        const mailResponse = await mailSender(this.email,this.otp)
        console.log('Mail response',mailResponse)
        next();
    }
    catch(err){
        console.log('Error in sending otp',err)
    }
})

module.exports = mongoose.model('Otp', OTPSchema);