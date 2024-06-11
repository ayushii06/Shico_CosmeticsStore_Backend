const ProductModel = require('../models/ProductModel.js');
const User = require('../models/UserModel.js')
const File = require('../models/File.js')
const {body,validationResult}=require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const asyncHandler = require('express-async-handler');
const { getWishlist } = require('./userCtrl.js');
const { ApiError } = require('../middlewares/ApiError.js');
const { ApiSuccess } = require('../middlewares/ApiError.js');
require('dotenv').config();
const {uploadFileToCloudinary}=require('../utils/uploadToCloudinary.js');


//the seller creates product
exports.createProduct = ([
body('product_name','invalid Name').isLength({min:3}),
body('desc','invalid description').isLength({min:5}),
],async (req, res) => {

  const {product_name,desc,selling_price,market_price,category}=req.body;
   let success=false;
   //if there is error then show status 400 with the error
   const error=validationResult(req);
   if(!error.isEmpty()){
    throw new ApiError(400,error.array());
   }

   try{

    const imgsrc = req.files.imgsrc;
    const imghoversrc = req.files.imghoversrc;

    const supportedTypes = ['png','jpg','jpeg','gif','webp',];
    const imgsrcType = imgsrc.name.split('.')[1];
    const imghoversrcType = imghoversrc.name.split('.')[1];
    
  if(!supportedTypes.includes(imgsrcType)){
            throw new ApiError(400,'File type not supported');
  }

  if(!supportedTypes.includes(imghoversrcType)){
    throw new ApiError(400,'File type not supported');
  }

    const imgsrcresponse = await uploadFileToCloudinary(imgsrc,process.env.CLOUDINARY_FOLDER);
    const imghoversrcresponse = await uploadFileToCloudinary(imghoversrc,process.env.CLOUDINARY_FOLDER);

   product = await ProductModel.create({
      product_name,
      desc,
      selling_price,
      market_price,
      category,
      imgsrc:imgsrcresponse.secure_url,
      imghoversrc:imghoversrcresponse.secure_url,
   });
  
   const data={
      product:{
         id:product.id
      }
   }

   success=true;
   const authtoken=jwt.sign(data,process.env.JWT_SECRET);
   console.log(authtoken);
   
   res.json({success,"authtoken":authtoken});
   } catch(error) {    
      console.error(error.message);
      res.status(500).json({success,error:'Internal Server Error'});

   }
 });

//the seller updates a product
exports.updateProduct = asyncHandler(async(req,res)=>{
  try {
    const {product_name,desc,selling_price,market_price,category,id}=req.body;

    const updatedProduct = await ProductModel.findByIdAndUpdate(id,
      {
        product_name,
        desc,
        selling_price,
        market_price,
        category
      },
      {
        new:true,
        runValidators:true
      }
    )
    
    res.status(200).json(new ApiSuccess(200,"Product updated successfully"))
  } catch (error) {
    throw new ApiError(400,error.message)
  }
})

//the seller deletes a product
exports.deleteProduct = asyncHandler(async (req, res) => {
  try{
    const {product_id} = req.params
    const product = await ProductModel.findByIdAndDelete(product_id)

    if(!product){
      throw new ApiError(400,"Product not found")
    }

    res.status(200).json(new ApiSuccess(200,"Product deleted successfully"))

  }
  catch(err){
    throw new ApiError(400,err.message)
  }
})

//the customer find all the products on the website
exports.getallProducts = async (req,res) =>{
   try {
      const products = await ProductModel.find()
      res.send(products)
   } catch (error) {
       console.error(error.message);
         res.status(500).send('Internal Server Error');
   }
   
}

//the customer finds a product by id (filtering, sorting, limiting fields, pagination)
exports.getaProduct = asyncHandler(async (req, res) => {
   try {
     // Filtering
     const queryObj = { ...req.query };
     const excludeFields = ["page", "sort", "limit", "fields"];
     excludeFields.forEach((el) => delete queryObj[el]);
     let queryStr = JSON.stringify(queryObj);
    
     queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);
     console.log(JSON.parse(queryStr))
     let query = ProductModel.find(JSON.parse(queryStr));
 
     // Sorting
 
     if (req.query.sort) {
       const sortBy = req.query.sort.split(",").join(" ");
       query = query.sort(sortBy);
     } else {
       query = query.sort("-createdAt");
     }
 
     // limiting the fields
 
     if (req.query.fields) {
       const fields = req.query.fields.split(",").join(" ");
       query = query.select(fields);
     } else {
       query = query.select("-__v");
     }
 
     // pagination
 
     const page = req.query.page;
     const limit = req.query.limit;
     const skip = (page - 1) * limit;
     query = query.skip(skip).limit(limit);
     if (req.query.page) {
       const productCount = await ProductModel.countDocuments();
       if (skip >= productCount) throw new Error("This Page does not exists");
     }
     const product = await query;
     res.json(product);
   } catch (error) {
     throw new Error(error);
   }
 });


 exports.addToWishlist = asyncHandler(async (req, res) => {
   const { _id } = req.user;
   const { prodId } = req.body;
   try {
     const user = await User.findById(_id);
     const alreadyadded = user.wishlist.find((id) => id.toString() === prodId);
     if (alreadyadded) {
       let user = await User.findByIdAndUpdate(
         _id,
         {
           $pull: { wishlist: prodId },
         },
         {
           new: true,
         }
       );
       res.json(user);
     } else {
       let user = await User.findByIdAndUpdate(
         _id,
         {
           $push: { wishlist: prodId },
         },
         {
           new: true,
         }
       );
       res.json(user);
     }
   } catch (error) {
     throw new Error(error);
   }
 });
 
 exports.rating = asyncHandler(async (req, res) => {
   const { _id } = req.user;
   const { star, prodId, comment } = req.body;
   try {
     const product = await ProductModel.findById(prodId);
     let alreadyRated = product.ratings.find(
       (userId) => userId.postedby.toString() === _id.toString()
     );
     if (alreadyRated) {
       const updateRating = await ProductModel.updateOne(
         {
           ratings: { $elemMatch: alreadyRated },
         },
         {
           $set: { "ratings.$.star": star, "ratings.$.comment": comment },
         },
         {
           new: true,
         }
       );
     } else {
       const rateProduct = await ProductModel.findByIdAndUpdate(
         prodId,
         {
           $push: {
             ratings: {
               star: star,
               comment: comment,
               postedby: _id,
             },
           },
         },
         {
           new: true,
         }
       );
     }

exports.getallratings = await ProductModel.findById(prodId);
     let totalRating = getallratings.ratings.length;
     let ratingsum = getallratings.ratings
       .map((item) => item.star)
       .reduce((prev, curr) => prev + curr, 0);
     let actualRating = Math.round(ratingsum / totalRating);
     let finalproduct = await ProductModel.findByIdAndUpdate(
       prodId,
       {
         totalrating: actualRating,
       },
       { new: true }
     );
     res.json(finalproduct);
   } catch (error) {
     throw new Error(error);
   }
 });

