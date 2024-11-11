const express=require('express');

const {updateProfile,deleteAccount,getProfile} = require('../controller/profileCtrl.js')
const {auth}=require('../middlewares/auth.js')

const router = express.Router();

router.get("/getProfile",auth,getProfile)
router.put("/updateProfile",auth,updateProfile)
router.delete("/deleteAccount",auth,deleteAccount)

module.exports = router;