const Profile = require('../models/ProfileModel');
const User = require('../models/UserModel');

//create profile
// exports.createProfile = async(req,res)=>{
//     try {
//         const {age,dob,gender}=req.body;
       
//         if(!age || !dob || !gender){
//             throw new ApiError(400,'Please fill all the fields')
//         }
//         const profile = new Profile({
//             age,
//             dob,
//             gender,
//         })
    
//         await profile.save();

        
//         res.status(200).json(new ApiSuccess(200,'Profile created successfully'))
//     } catch (error) {
//         throw new ApiError(400, error.message)
//     }
// }

//update profile
exports.updateProfile=async(req,res)=>{
    try {
        const {age,dob,gender}=req.body;
        const user_id = req.user.id;

        if(!user_id){
            res.status(500).json({
                sucess:false,
                message:'Please provide the id of the user'
            })
           
        }

        const user = await User.findById(user_id)
        if(!user){
            res.status(500).json({
                sucess:false,
                message:'User not found'
            })
        }

        const profile_id = user.additionalDetails;
        const profile = await Profile.findById(profile_id)
        if(!profile){
            res.status(500).json({
                sucess:false,
                message:'Profile not found'
            })
        }
        profile.age = age;
        profile.dob = dob;
        profile.gender=gender;

        await profile.save();
        
        res.status(200).json({
            success:true,
            message:'Profile updated successfully'})

    } catch (error) {
        res.status(400).json({
            success:false,
            message:error.message
        })
    }
}

//delete profile
exports.deleteAccount = async(req,res)=>{
    try {
        const id = req.user.id;
        if(!id){
            res.status(500).json({
                sucess:false,
                message:'Please provide the id of the user'
            })
           
        }
        const user = await User.findById(id)
        if(!user){
            res.status(500).json({
                sucess:false,
                message:'User not found'
            })
        }
    
        const profile_id = user.additionalDetails;
        await Profile.findByIdAndDelete(profile_id)
    
        await User.findByIdAndDelete(id)
        res.status(200).json({
            success:true,
            message:'Account deleted successfully'
        })
    } catch (error) {
        res.status(500).json({
            sucess:false,
            message:error.message
        })
        
    }
}

exports.getProfile = async(req,res)=>{
    const id = req.user.id;

    if(!id){
        res.status(500).json({
            sucess:false,
            message:'Please provide the id of the user'
        })
    }

    const user = await User.findById(id)
    if(!user){
        res.status(500).json({
            sucess:false,
            message:'User not found'
        })
    }

    const data = await User.findById(id).populate('additionalDetails').exec();
    res.status(200).json({
        sucess:true,
        data,
        message:'Profile retrieved successfully'
    })}