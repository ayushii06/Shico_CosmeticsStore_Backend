const { ApiSuccess } = require('../middlewares/apiSuccess');
require('dotenv').config();
const cloudinary = require('cloudinary').v2;

exports.cloudinaryConnect = async (req, res) => {
    try {
        cloudinary.config({
        cloud_name: process.env.CLOUD_NAME,
        api_key: process.env.API_KEY,
        api_secret: process.env.API_SECRET,
        });
        return res.status(200).json(new ApiSuccess(200, "Cloudinary Connected Successfully"));
    } catch (error) {
        throw new ApiError(500, error.message);
    }
}