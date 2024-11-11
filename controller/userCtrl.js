const User = require('../models/UserModel.js')
const OTP = require('../models/OtpModel.js')
const Profile = require('../models/ProfileModel.js')
// const otpGenerator = require('otp-generator');
// const {body,validationResult}=require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();
// const asyncHandler = require('express-async-handler')
// const { generateToken } = require("../config/jwtToken");
// const validateMongoDbId = require("../utils/validateMongodbId");
// const {generateRefreshToken} = require("../config/refreshtoken.js")
// const crypto = require("crypto");

exports.signUp = async (req, res) => {
  try {

    //input during sign up
    const { name, email, mobile, password, cpass, accountType } = req.body;

    let user_email = await User.findOne({ email: email });

    //checking if the email already exists
    if (user_email) {
      res.status(400).json({
        success: false,
        message: 'Email ALready exists'
      })
    }

    let user_mobile = await User.findOne({ mobile: mobile });

    //checking if the mobile number already exists
    if (user_mobile) {
      res.status(400).json({
        success: false,
        message: "Mobile Number ALready exists"

      })
    }

    //if cpass & pass do not match, throw error
    if (password !== cpass) {
      res.status(400).json({
        success: false,
        message: "Confirm Password do not match"

      })
    }

    //hashing the password using bcrypt
    const secPass = await bcrypt.hash(password, 10);

    // let approved = ""
    // approved === "Instructor" ? (approved = false) : (approved = true)

    //creating the default null profile, user will update it later in profile section

    const profileDetails = await Profile.create({
      age: null,
      gender: null,
      dateOfBirth: null,
      address: null,
      avatar: "",
    })

    //creating the user entry in database
    const user = await User.create({
      name,
      email,
      mobile,
      password: secPass,
      accountType: accountType,
      additionalDetails: profileDetails._id,
    })

    //sending the response
    return res.status(201).json({
      success: true,
      user,
      message: "User Registered Successfully",
    })

  }
  catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    })
  }
}

exports.sendOTP = async (req, res) => {
  try {
    //getting user email
    const { email } = req.body;

    //checking whether the user already exists
    const user = await User.findOne({ email: email });
    if (user) {
      res.status(400).json({
        success: false,
        message: 'User already exists'
      })
    }

    //generating otp to be sent
    let otp = '';
    let alreadyExists = true;
    
    while (alreadyExists) {
      otp = '';
      for (let i = 0; i < 4; i++) {
        otp += Math.floor(Math.random() * 10); // Generate a random digit
      }
      alreadyExists = await OTP.findOne({ otp: otp }); // Check if generated OTP already exists, if yes, regenerate to ensure uniqueness
    }

    //prepares the data to be stored in the database
    const otpPayload = { email: email, otp: otp };

    //creating the otp entry in the database
    const newOTP = await OTP.create(otpPayload);
    console.log(newOTP);

    return res.status(200).json({
      success: true,
      message: "OTP sent successfully"
    })

  }
  catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    })
  }
}

exports.verifyOTP = async (req, res) => {
  try {
    //getting the otp and email from the input
    const { otp, email } = req.body;

    //finding the recent otp created for the email
    const recentOtp = await OTP.findOne({ email: email }).sort({ createdAt: -1 }).limit(1); //limit(1) basically

    //throw error if no recent otp found
    if (!recentOtp) {
      return res.status(400).json({
        success: false,
        message: "No OTP found"

      })

    }

    //if otp do not match throw error
    if (recentOtp.otp !== otp) {
      return res.status(400).json({
        success: false,
        message: "OTP is incorrect"

      })
    }

    return res.status(200).json({
      success: true,
      message: "OTP is correct"
    })


  }
  catch (err) {
    res.status(500).json({
      success: false,
      message: err.message
    })
  }
}

exports.login = async (req, res) => {
  try {

    //get input from user
    const { email, password } = req.body;
    if (!email || !password) {
      res.status(400).json({
        success: false,
        message: 'Fill details carefully'
      })
    }

    //finding user for the given email
    var user = await User.findOne({ email: email }).populate("additionalDetails");

    //throw error if user not found
    if (!user) {
      res.status(400).json({
        success: false,
        message: "User Not Found"
      })
    }

    //creating payload
    const payload = {
      id: user._id,
      email: user.email,
      role: user.role,
    }

    //check password is correct or not
    if (await bcrypt.compare(password, user.password)) {

      //generating the jwt signed access token
      const token = jwt.sign(payload, process.env.JWT_SECRET, {
        expiresIn: "1d",
      });

      user = user.toObject(); //
      user.accessToken = token;
      user.password = undefined;

      //
      const options = {
        expiresIn: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
        httpOnly: true,
      }

      //
      res.cookie("token", token, options).status(200).json(
        {
          success: true,
          user: user,
          accessToken: token,
          message: "User Logged In Successfully"
        }
      )
    }
    else {
      return res.status(403).json({
        success: false,
        message: 'Please login with correct credentials',
      })
    }
  }
  catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    })
  }
}




//logout




//  // Delete a single user

exports.deleteaUser = (async (req, res) => {
  try {
    const { id } = req.params;
    const deleteaUser = await User.findByIdAndDelete(id);
    res.json({
      deleteaUser,
    });

  }
  catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    })
  }

});


//  const handleRefreshToken = asyncHandler(async (req, res) => {
//    const cookie = req.cookies;
//    if (!cookie?.refreshToken) throw new Error("No Refresh Token in Cookies");
//    const refreshToken = cookie.refreshToken;
//    const user = await User.findOne({ refreshToken });
//    if (!user) throw new Error(" No Refresh token present in db or not matched");
//    jwt.verify(refreshToken, process.env.JWT_SECRET, (err, decoded) => {
//      if (err || user.id !== decoded.id) {
//        throw new Error("There is something wrong with refresh token");
//      }
//      const accessToken = generateToken(user?._id);
//      res.json({ accessToken });
//    });
//  });



exports.forgotPasswordToken = (async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email });
  if (!user) {
    return res.status(403).json({
      success: false,
      message: "User not found with this email",
    })
  }
  try {
    const token = await user.createPasswordResetToken();
    await user.save();

    const resetURL = `Hi, Please follow this link to reset Your Password. This link is valid till 10 minutes from now. <a href='http://localhost:5000/api/user/reset-password/${token}'>Click Here</>`;

    const data = {
      to: email,
      text: "Hey User",
      subject: "Forgot Password Link",
      htm: resetURL,
    };

    sendEmail(data);
    res.json(token);

  } catch (error) {
    throw new Error(error);
  }
});



exports.getWishlist = (async (req, res) => {
  try {

    const { _id } = req.user;

    const findUser = await User.findById(_id).populate("wishlist");
    res.json(findUser);
  } catch (error) {
    throw new Error(error);
  }
});