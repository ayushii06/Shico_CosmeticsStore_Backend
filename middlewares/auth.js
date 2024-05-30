const jwt=require('jsonwebtoken');
const User = require('../models/UserModel')
require('dotenv').config();
const asyncHandler = require("express-async-handler");
const { ApiError } = require('./ApiError');

exports.auth = asyncHandler(async (req,res,next)=> {
    if(req.headers.authorization && req.headers.authorization.startsWith('Bearer')){
        try {
            let token = req.headers.authorization.split(' ')[1];
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            req.user = await User.findById(decoded.id).select('-password');
            next();
        } catch (error) {
            throw new ApiError(401,'Not Authorized, Token Failed');
        }
    }
    if(!token){
        throw new ApiError(401,'Not Authorized, No Token');
    }
})

exports.isBuyer = async(req,res,next)=>{
  try {
      if(req.user.role === 'buyer'){
          next();
      }else{
          throw new ApiError(403,'Not Authorized, Only Buyer Can Access');
      }
  } catch (error) {
        throw new ApiError(403,error.message);
  }
}

exports.isSeller = async(req,res,next)=>{
    try {
        if(req.user.role === 'seller'){
            next();
        }else{
            throw new ApiError(403,'Not Authorized, Only Seller Can Access');
        }
    } catch (error) {
          throw new ApiError(403,error.message);
    }
  }