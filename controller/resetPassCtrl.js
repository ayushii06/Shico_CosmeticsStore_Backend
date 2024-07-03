const User = require("../models/UserModel");
const mailSender = require("../utils/mailSender");
const bcrypt = require('bcryptjs');


exports.generateResetToken = async (req,res)=>{
    try {
        const email = req.body.email;
    
        const user = await User.findOne({email:email});
        if(!user){
            return res.status(404).json({message:'User not found'});
        }
    
        const token = await user.createPasswordResetToken();
    
        console.log(token)
        const updateUser = await User.findOneAndUpdate(
            {
                email:email,
            },
            {
                passwordResetToken:token,
                passwordResetExpires:Date.now() + 5*60*1000,
            },
            {
                new:true,
            }
        )
    
        const url = `http://localhost:3000/resetPassword/${token}`;
    
        await mailSender(
            email,'Password Reset',`Click on the link to reset your password ${url}`,
             
        )

        return res.status(200).json({
            success:true,
            message:"Password Reset Link Sent Successfully"
        }
    )
    } catch (error) {
        return res.status(500).json({
            success:false,
            message:error.message
        })
    }
}

exports.resetPass = async(req,res)=>{
    const {token , password, confirmPassword} = req.body;
    if(!token || !password || !confirmPassword){
        return res.status(400).json({
            success:false,
            message:"All fields are required"
        })
        
    }

    if(password !== confirmPassword){
        return res.status(400).json({
            success:false,
            message:"Passwords do not match"
        })
    }

    let user = await User.findOne({
        passwordResetToken:token,
    })

    if(!user){
        return res.status(400).json({
            success:false,
            message:'Token is invalid or expired'
        })
    }

    if(user.passwordResetExpires < Date.now()){
        return res.status(400).json({
            success:false,
            message:'Token is expired'
        })
    }

    const hashedPassword = await bcrypt.hash(password,10);

    await User.findOneAndUpdate(
        {
            email:user.email,
        },
        {
            password:hashedPassword,
            passwordResetToken:null,
            passwordResetExpires:null,
        }
    )

    return res.status(200).json({
        success:true,
        message:"Password reset successfully"
})

}