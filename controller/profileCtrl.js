const { ApiError } = require('../middlewares/ApiError');
const { ApiSuccess } = require('../middlewares/apiSuccess');
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
            throw new ApiError(400,'Please provide the id of the user')
        }

        const user = await User.findById(user_id)
        if(!user){
            throw new ApiError(400,'User not found')
        }

        const profile_id = user.additionalDetails;
        const profile = await Profile.findById(profile_id)
        if(!profile){
            throw new ApiError(400,'Profile not found')
        }
        profile.age = age;
        profile.dob = dob;
        profile.gender=gender;

        await profile.save();
        
        res.status(200).json(new ApiSuccess(200,'Profile updated successfully'))

    } catch (error) {
        throw new ApiError(400, error.message)
    }
}

//delete profile
exports.deleteAccount = async(req,res)=>{
    try {
        const id = req.user.id;
        if(!id){
            throw new ApiError(400,'Please provide the id of the user')
        }
        const user = await User.findById(id)
        if(!user){
            throw new ApiError(400,'User not found')
        }
    
        const profile_id = user.additionalDetails;
        await Profile.findByIdAndDelete(profile_id)
    
        await User.findByIdAndDelete(id)
        res.status(200).json(new ApiSuccess(200,'Account deleted successfully'))
    } catch (error) {
        throw new ApiError(400, error.message)
        
    }
}

exports.getProfile = async(req,res)=>{
    const id = req.user.id;

    if(!id){
        throw new ApiError(400,'Please provide the id of the user')
    }

    const user = await User.findById(id)
    if(!user){
        throw new ApiError(400,'User not found')
    }

    const data = await User.findById(id).populate('additionalDetails').exec();
    res.status(200).json(new ApiSuccess(200,'Profile retrieved successfully',data))
}