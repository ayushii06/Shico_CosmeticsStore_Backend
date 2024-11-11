// Load environment variables from a .env file into process.env
require('dotenv').config();

// Import the Cloudinary library and use its v2 API
const cloudinary = require('cloudinary').v2;

// Asynchronously configure and establish a connection to Cloudinary
exports.cloudinaryConnect = async (req, res) => {
    try {
        // Set up Cloudinary configuration using credentials stored in environment variables
        cloudinary.config({
            cloud_name: process.env.CLOUD_NAME,
            api_key: process.env.API_KEY,
            api_secret: process.env.API_SECRET,
        });
    } catch (error) {
        // Log any errors encountered during configuration to the console
        console.log(error);
    }
}
