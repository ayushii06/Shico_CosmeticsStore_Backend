const express=require('express');
const {auth}=require('../middlewares/auth.js')
const User =require('../models/UserModel.js')
const {signUp,sendOTP,verifyOTP,login,forgotPassword}=require('../controller/userCtrl.js');
const router = express.Router();
const {generateResetToken,resetPass} = require('../controller/resetPassCtrl.js')

router.post('/signup',signUp);
router.post('/login',login);
router.post('/otp',sendOTP);
router.post('/verifyotp',verifyOTP);
router.post('/forgotPassword',forgotPassword);
router.post('/generateResetToken',generateResetToken)
router.post('/resetpassword',resetPass)


// router.post("/register", createUser);
// router.post("/forgot-password-token", forgotPasswordToken);
// router.put("/reset-password/:token", resetPassword);
// router.put("/password", fetchuser, updatePassword);
// router.post("/login", loginUserCtrl);
// router.post("/:id",fetchuser, loginDetail);
// router.post("/cart", fetchuser, userCart);
// router.get("/refresh", handleRefreshToken);
// router.get("/logout", logout);
// router.get("/wishlist", fetchuser, getWishlist);
// router.get("/cart", fetchuser, getUserCart);

// router.delete("/empty-cart", fetchuser, emptyCart);
// router.delete("/:id", deleteaUser);
// router.put("/save-address", fetchuser, saveAddress);


module.exports=router