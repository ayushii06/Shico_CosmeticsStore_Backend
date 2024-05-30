const mongoose=require('mongoose');

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
      required:true,
    },
    role:{
        type:String,
        default:"user",
    },
    cart:[{
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
    }],
    address:{
        type:String,
    },
    wishlist: [{ type: mongoose.Schema.Types.ObjectId, ref: "Product" }],
    accessToken: {
      type: String,
    },
    refreshToken: {
      type: String,
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