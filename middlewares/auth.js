const jwt=require('jsonwebtoken');
const User = require('../models/UserModel')
require('dotenv').config();
const asyncHandler = require("express-async-handler");

exports.auth = asyncHandler(async (req,res,next)=> {
    if(req.headers.authorization && req.headers.authorization.startsWith('Bearer')){
        try {
            let token = req.headers.authorization.split(' ')[1];
            if(!token){
                res.status(400).json({
                    success:false,
                    message:'Not Authorized, No Token'
                })
            }
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            req.user = await User.findById(decoded.id).select('-password');
            next();
        } catch (error) {
            res.status(400).json({
                success:false,
                message:'Not Authorized, Token Failed'
            })
        }
    }
  
})

exports.isBuyer = async(req,res,next)=>{
  try {
      if(req.user.role === 'buyer'){

          next();
      }else{
        res.status(400).json({
            success:false,
            message:'Not Authorized, Only Buyer Can Access'
        })
      }
  } catch (error) {
    res.status(400).json({
        success:false,
        message:error.message
    })
    
  }
}

exports.isSeller = async(req,res,next)=>{
    try {
        if(req.user.role === 'seller'){
            next();
        }else{
            res.status(400).json({
                success:false,
                message:'Not Authorized, Only Seller Can Access'
            })
        }
    } catch (error) {
        res.status(400).json({
            success:false,
            message:error.message
        })
    }
  }