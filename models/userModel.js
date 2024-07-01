const mongoose=require('mongoose');
const bcrypt=require('bcryptjs');
const mailSender = require("../utils/mailSender");
const registrationMessage= require('../mailTemplates/RegistrationSuccess');

var userSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true,
    },
    email:{
        type:String,
        required:true,
        unique:true,
    },
    mobile:{
        type:String,
        required:true,
        unique:true,
    },
    password:{
        type:String,
        required:true,
    },
    cpass:{
      type:String,
    },
    role:{
        type:String,
    },
    cart:[{
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
    }],
    wishlist: [{ type: mongoose.Schema.Types.ObjectId, ref: "Product" }],
    accessToken: {
      type: String,
    },
    refreshToken: {
      type: String,
    },
    additionalDetails:{
      type:mongoose.Schema.Types.ObjectId,
      ref:'Profile'
    },
    passwordChangedAt: Date,
    passwordResetToken: String,
    passwordResetExpires: Date,
  },
  {
    timestamps: true,
  }
);

userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) {
      next();
    }
    this.password=bcrypt.hash(this.password,10)
    next()
  });
 

userSchema.post("save",async function (doc){
  try {
     await mailSender(
			doc.email,
			"Verification Email",
			registrationMessage('Welcome to our store','Welcome to our store, we are glad to have you on board. You are successfully registered. Thank you for choosing us!')
		);    
  } catch (error) {
    res.status(400).json({
      success:false,
      message:error.message
  })
  }  
})

userSchema.methods.createPasswordResetToken = async function () {
    const resettoken = crypto.randomBytes(32).toString("hex");
    this.passwordResetToken = crypto
      .createHash("sha256")
      .update(resettoken)
      .digest("hex");
    this.passwordResetExpires = Date.now() + 30 * 60 * 1000; // 10 minutes
    return resettoken;
  };

//Export the model
module.exports= mongoose.model('User', userSchema);