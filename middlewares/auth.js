const jwt=require('jsonwebtoken');
const User = require('../models/UserModel')
require('dotenv').config();
const asyncHandler = require("express-async-handler");


const auth =asyncHandler(async (req,res,next)=>{
    const token = req.header('Authorization').replace('Bearer ','');
    console.log(token)
    if(!token){
        return res.status(401).send({error : "You have not sent a token in the header"})
    }
    try {
        const data = jwt.verify(token,process.env.JWT_SECRET);
        console.log(data)
        const user = await User.findById(data?._id);
        req.user=user;
        next();
 
    }catch (error) {
        res.status(401).send({error : "Please authenticate using a valid token"})
        
    }
  
})


module.exports={auth};