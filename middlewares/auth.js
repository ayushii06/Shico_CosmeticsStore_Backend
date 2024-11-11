const jwt = require('jsonwebtoken');
const User = require('../models/UserModel')
require('dotenv').config();
const asyncHandler = require("express-async-handler");

// Middleware to check if the user is authenticated
exports.auth = asyncHandler(async (req, res, next) => {
    // Check if the authorization header exists and starts with "Bearer"
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            // Extract token from the authorization header
            let token = req.headers.authorization.split(' ')[1];
            if (!token) {
                // If no token is found, return an error response
                res.status(400).json({
                    success: false,
                    message: 'Not Authorized, No Token'
                });
            }

            // Verify the token using the secret key
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            // Find the user from the database using the decoded id and attach it to the request object
            req.user = await User.findById(decoded.id).select('-password');
            next();  // Proceed to the next middleware or route handler
        } catch (error) {
            // If token verification fails, return an error response
            res.status(400).json({
                success: false,
                message: 'Not Authorized, Token Failed'
            });
        }
    }
})

// Middleware to check if the authenticated user is a buyer
exports.isBuyer = async (req, res, next) => {
    try {
        // Check if the user's role is 'buyer'
        if (req.user.role === 'buyer') {
            next();  // Proceed to the next middleware or route handler
        } else {
            // If the user is not a buyer, return an error response
            res.status(400).json({
                success: false,
                message: 'Not Authorized, Only Buyer Can Access'
            });
        }
    } catch (error) {
        // Catch any errors and send a response with the error message
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
}

// Middleware to check if the authenticated user is a seller
exports.isSeller = async (req, res, next) => {
    try {
        // Check if the user's role is 'seller'
        if (req.user.role === 'seller') {
            next();  // Proceed to the next middleware or route handler
        } else {
            // If the user is not a seller, return an error response
            res.status(400).json({
                success: false,
                message: 'Not Authorized, Only Seller Can Access'
            });
        }
    } catch (error) {
        // Catch any errors and send a response with the error message
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
}
