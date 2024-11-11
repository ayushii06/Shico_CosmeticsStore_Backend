const ProductModel = require('../models/ProductModel.js');
const User = require('../models/UserModel.js');
const asyncHandler = require('express-async-handler');
require('dotenv').config();
const { uploadFileToCloudinary } = require('../utils/uploadToCloudinary.js');

// Creating the product
exports.createProduct = async (req, res) => {
   try {
    // Extract product details from the request body
    const { product_name, desc, stock, selling_price, market_price, category } = req.body;

    const imgsrc = req.files.imgsrc;
    const imghoversrc = req.files.imghoversrc;

    const supportedTypes = ['png', 'jpg', 'jpeg', 'gif', 'webp']; // Supported image file types
    const imgsrcType = imgsrc.name.split('.')[1]; // Get file extension for the image
    const imghoversrcType = imghoversrc.name.split('.')[1]; // Get file extension for hover image
    
    // Check if the uploaded file types are supported
    if (!supportedTypes.includes(imgsrcType)) {
      res.status(400).json({
        success: false,
        message: "File type not supported"
      });
    }

    if (!supportedTypes.includes(imghoversrcType)) {
      res.status(400).json({
        success: false,
        message: "File type not supported"
      });
    }

    const imgsrcresponse = await uploadFileToCloudinary(imgsrc, process.env.CLOUDINARY_FOLDER);
    const imghoversrcresponse = await uploadFileToCloudinary(imghoversrc, process.env.CLOUDINARY_FOLDER);
  
    product = await ProductModel.create({
       product_name,
       desc,
       stock,
       selling_price,
       market_price,
       category,
       imgsrc: imgsrcresponse.secure_url,
       imghoversrc: imghoversrcresponse.secure_url,
    });
  
    res.status(201).json({
      success: true,
      message: "Product created successfully",
      product
    });
   } catch (error) {    
      console.error(error.message);
      res.status(500).json({ success: false, error: 'Internal Server Error' });
   }
};

// The seller updates a product
exports.updateProduct = async (req, res) => {
  try {
    // Extract product details from the request body
    const { product_name, desc, selling_price, market_price, category, id } = req.body;

    const updatedProduct = await ProductModel.findByIdAndUpdate(id,
      {
        product_name,
        desc,
        selling_price,
        market_price,
        category
      },
      {
        new: true, // Ensure we get the updated document back
        runValidators: true  // Ensure validators are applied
      }
    );
    res.status(200).json({
      success: true,
      message: "Product updated successfully"
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message,
    });
  }
}

// The seller deletes a product
exports.deleteProduct = async (req, res) => {
  try {
    // Extract product ID from request parameters
    const { product_id } = req.params;
    const product = await ProductModel.findByIdAndDelete(product_id);

    if (!product) {
      res.status(400).json({
        success: false,
        message: "Product Not Found"
      });
    }

    res.status(200).json({
      success: true,
      message: "Product deleted successfully"
    });

  } catch (err) {
    res.status(400).json({
      success: false,
      error: err.message,
    });
  }
}

// The customer finds all the products on the website
exports.getallProducts = async (req, res) => {
   try {
      const products = await ProductModel.find();
      if (!products) {
        res.status(400).json({
          success: false,
          message: "No products found"
        });
      }
      res.status(200).json({
        success: true,
        products
      });
   } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
   }
}

// The customer finds a product by ID (filtering, sorting, limiting fields, pagination)
exports.getaProduct = async (req, res) => {
   try {
     // Filtering
     const queryObj = { ...req.query };
     const excludeFields = ["page", "sort", "limit", "fields"];
     excludeFields.forEach((el) => delete queryObj[el]);
     let queryStr = JSON.stringify(queryObj);
    
     queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);
     console.log(JSON.parse(queryStr));
     let query = ProductModel.find(JSON.parse(queryStr));

     // Sorting
     if (req.query.sort) {
       const sortBy = req.query.sort.split(",").join(" ");
       query = query.sort(sortBy);
     } else {
       query = query.sort("-createdAt");
     }

     // Limiting the fields
     if (req.query.fields) {
       const fields = req.query.fields.split(",").join(" ");
       query = query.select(fields);
     } else {
       query = query.select("-__v");
     }

     // Pagination
     const page = req.query.page;
     const limit = req.query.limit;
     const skip = (page - 1) * limit;
     query = query.skip(skip).limit(limit);
     if (req.query.page) {
       const productCount = await ProductModel.countDocuments();
       if (skip >= productCount) throw new Error("This Page does not exist");
     }
     const product = await query;
     res.json(product);
   } catch (error) {
     throw new Error(error);
   }
 };

// Fetch all information about the product
exports.fetchAllData = async (req, res) => {
  try {
    // Extract product ID from request body
    const { prodId } = req.body;
    const product = await ProductModel.findOne({ _id: prodId }).populate({
       path: 'ratings',
       select: 'rate desc'
    }).exec(); 
    
    if (!product) {
      return res.status(400).json({
        success: false,
        message: "Product not found"
      });
    }

    return res.status(200).json({
      success: true,
      product,
      message: "Details fetched successfully"
    });
  }
  catch (err) {
    console.error(err.message);
    return res.status(500).json({ success: false, error: 'Internal Server Error' });
  }
}

// Add product to wishlist
exports.addToWishlist = async (req, res) => {
   try {
    // Get user ID and product ID from request
    const { _id } = req.user;
    const { prodId } = req.body;

    const user = await User.findById(_id);

    // Check if the product is already in the wishlist
    const alreadyadded = user.wishlist.find((id) => id.toString() === prodId);

    if (alreadyadded) {
       let user = await User.findByIdAndUpdate(
         _id,
         {
           $pull: { wishlist: prodId }, // Remove product from wishlist
         },
         {
           new: true, // Return the updated user
         }
       );
       res.json(user);
     } else {
       let user = await User.findByIdAndUpdate(
         _id,
         {
           $push: { wishlist: prodId }, // Add product to wishlist
         },
         {
           new: true,
         }
       );
       res.json(user);
     }
   } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
   }
};
