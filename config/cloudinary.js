const { ApiSuccess } = require('../middlewares/apiSuccess');
const { ApiError } = require('../middlewares/ApiError');
require('dotenv').config();
const cloudinary = require('cloudinary').v2;

exports.cloudinaryConnect = async (req, res) => {
    try {
        cloudinary.config({
        cloud_name: process.env.CLOUD_NAME,
        api_key: process.env.API_KEY,
        api_secret: process.env.API_SECRET,
        });
        return res.status(200).json({
            success: true,
            message: "Cloudinary connected successfully"
        
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
       

    }
}