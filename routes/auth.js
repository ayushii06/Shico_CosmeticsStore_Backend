const express=require('express');
const {signUp,sendOTP,verifyOTP,login}=require('../controller/userCtrl.js');
const router = express.Router();
const {generateResetToken,resetPass} = require('../controller/resetPassCtrl.js')

router.post('/signup',signUp);
router.post('/login',login);
router.post('/otp',sendOTP);
router.post('/verifyotp',verifyOTP);
router.post('/generateResetToken',generateResetToken)
router.post('/resetpassword',resetPass)


module.exports=router