const User = require("../models/UserModel");
const mailSender = require("../utils/mailSender");
const bcrypt = require('bcryptjs');
const resetPassMail = require('../mailTemplates/resetpass')

exports.generateResetToken = async (req, res) => {
    try {
        const email = req.body.email; // Get the email from the request body

        // Find the user by email
        const user = await User.findOne({ email: email });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Generate a password reset token
        const token = await user.createPasswordResetToken();

        console.log(token); // Log the token for debugging

        // Update the user with the reset token and expiration time (5 minutes)
        const updateUser = await User.findOneAndUpdate(
            {
                email: email,
            },
            {
                passwordResetToken: token,
                passwordResetExpires: Date.now() + 5 * 60 * 1000, // Token expires in 5 minutes
            },
            {
                new: true, // Return the updated user document
            }
        );

        // Create the password reset URL
        const url = `http://localhost:3000/resetPassword/${token}`;

        // Send the password reset email with the link
        await mailSender(
            email,
            "Password Reset",
            resetPassMail(`Click on the link to reset your password ${url}`)
        );

        return res.status(200).json({
            success: true,
            message: "Password Reset Link Sent Successfully"
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

exports.resetPass = async (req, res) => {
    try {
        const { token, password, confirmPassword } = req.body;

        if (!token || !password || !confirmPassword) {
            return res.status(400).json({
                success: false,
                message: "All fields are required"
            });
        }

        if (password !== confirmPassword) {
            return res.status(400).json({
                success: false,
                message: "Passwords do not match"
            });
        }

        // Find the user with the provided reset token
        let user = await User.findOne({
            passwordResetToken: token,
        });

        if (!user) {
            return res.status(400).json({
                success: false,
                message: 'Token is invalid or expired'
            });
        }

        // Check if the token has expired
        if (user.passwordResetExpires < Date.now()) {
            return res.status(400).json({
                success: false,
                message: 'Token is expired'
            });
        }

        // Hash the new password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Update the user's password and clear the reset token and expiration
        await User.findOneAndUpdate(
            {
                email: user.email,
            },
            {
                password: hashedPassword,
                passwordResetToken: null, // Clear the reset token
                passwordResetExpires: null, // Clear the reset expiration
            }
        );

        return res.status(200).json({
            success: true,
            message: "Password reset successfully"
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};
