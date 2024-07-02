const ProductModel = require('../models/ProductModel.js');
const User = require('../models/UserModel.js')
const File = require('../models/File.js')
const {body,validationResult}=require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const asyncHandler = require('express-async-handler');
const { getWishlist } = require('./userCtrl.js');
require('dotenv').config();
const {uploadFileToCloudinary}=require('../utils/uploadToCloudinary.js');
const Category = require('../models/CategoryModel.js');

//the seller creates product
exports.createProduct =async (req, res) => {


   try{
    const {product_name,desc,stock,selling_price,market_price,category}=req.body;
   let success=false;

    const imgsrc = req.files.imgsrc;
    
    const imghoversrc = req.files.imghoversrc;

    const supportedTypes = ['png','jpg','jpeg','gif','webp',];
    const imgsrcType = imgsrc.name.split('.')[1];
  
    const imghoversrcType = imghoversrc.name.split('.')[1];
    
  if(!supportedTypes.includes(imgsrcType)){
    res.status(400).json({
      success:false,
      message:"File type not supported"
    })
  
  }

  if(!supportedTypes.includes(imghoversrcType)){
    res.status(400).json({
      success:false,
      message:"File type not supported"
    })
  }

    const imgsrcresponse = await uploadFileToCloudinary(imgsrc,process.env.CLOUDINARY_FOLDER);
    const imghoversrcresponse = await uploadFileToCloudinary(imghoversrc,process.env.CLOUDINARY_FOLDER);

   product = await ProductModel.create({
      product_name,
      desc,
      stock,
      selling_price,
      market_price,
      category,
      imgsrc:imgsrcresponse.secure_url,
      imghoversrc:imghoversrcresponse.secure_url,
   });


   //push the product id to the category
    // const Category = await Category.findById(category);
    // Category.products.push(product._id);
    // await Category.save();

  
  
   res.json({success:true,product});
   } catch(error) {    
      console.error(error.message);
      res.status(500).json({success:false,error:'Internal Server Error'});

   }};

//the seller updates a product
exports.updateProduct = async(req,res)=>{
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
    res.status(200).json({
      success:true,
      message:"Product updated successfully"
    })
  } catch (error) {
    res.status(400).json({
      success:false,
      error:error.message,
      message:"File type not supported"
    })
  }
}

//the seller deletes a product
exports.deleteProduct = async (req, res) => {
  try{
    const {product_id} = req.params
    const product = await ProductModel.findByIdAndDelete(product_id)

    if(!product){
      res.status(400).json({
        success:false,
        message:"Product Not Found"
      })
    }

    res.status(200).json({
      success:true,
      message:"Product deleted successfully"
    })

  }
  catch(err){
    res.status(400).json({
      success:false,
      error:error.message,
    })
  }
}

//the customer find all the products on the website
exports.getallProducts = async (req,res) =>{
   try {
      const products = await ProductModel.find()
      if(!products){
        res.status(400).json({
          success:false,
          message:"no products found"
        })
      }
      res.status(200).json({
        success:true,
        products
      })

   } catch (error) {
    res.status(500).json({
      success:false,
      error:error.message,
      message:"Internal Server Error"
    })
       console.error(error.message);
   }
   
}

//the customer finds a product by id (filtering, sorting, limiting fields, pagination)
exports.getaProduct = asyncHandler(async (req, res) => {
   try {
    console.log(req.params.id)
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

exports.fetchAllData = async(req,res)=>{
  try{
    const {prodId} = req.body;
    const product = await ProductModel.findOne({_id: prodId}).populate({
       path: 'ratings',
      select: 'rate desc '

    }).exec(); 
    
    if(!product){
      return res.status(400).json({
        success:false,
        message:"Product not found"
      })
    }

    return res.status(200).json({
      success:true,
      product,
      message:"Details fetched successfully"
    })
  }
  catch(err){
    console.error(err.message);
   return res.status(500).json({success:false,error:'Internal Server Error'});

  }
}

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
 
