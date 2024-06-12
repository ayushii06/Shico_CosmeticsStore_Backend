const { ApiError } = require("../middlewares/ApiError");
const { ApiSuccess } = require("../middlewares/apiSuccess");
const file = require("../models/File");
const cloudinary = require("cloudinary").v2;
const Product = require("../models/ProductModel");

exports.localfileUpload = async (req, res) => {
  try {
    const file = req.files.file;
    console.log(file);
    const path = __dirname + "/uploads/" + Date.now()+ `.${file.name.split('.')[1]}`;

    file.mv(path, (err) => {
      if (err) {
      throw new ApiError(500, "Error in uploading file");
      }
    });

    return res.status(200).json(new ApiSuccess(200, "File Uploaded Successfully"));
  } catch (error) {
    throw new ApiError(500, error.message);
  }
}

// function isFileTypeSupported(type,supportedTypes){
//   return supportedTypes.includes(type);
// }

exports.uploadFileToCloudinary = async (file, folder, height, quality) => {
    const options = {folder};
    if(height) {
        options.height = height;
    }
    if(quality) {
        options.quality = quality;
    }
    options.resource_type = "auto";

    return await cloudinary.uploader.upload(file.tempFilePath, options);
}


// exports.imageUpload = async (req, res) => {
//     try {
//       const {email} = req.body;

//       const file = req.files.file;

//       //now validate 

//       const supportedTypes = ['png','jpg','jpeg','gif','webp',];
//       const filetype = file.name.split('.')[1];

//       if(!isFileTypeSupported(filetype,supportedTypes)){
//         throw new ApiError(400,'File type not supported');
//       }
      
//       const response = await uploadFileToCloudinary(file,'images');

//       const newFile = await file.create({
//         name,
//         email,
//         path:response.secure_url,
//       })

//       Product.updateOne({email},{$set:{imgsrc:newFile._id}},{new:true});
//     } catch (error) {
//       throw new ApiError(500, error.message);
//     }
// }

// exports.videoUpload = async (req, res) => {
//   try {
//     const { email} = req.body;

//     const file = req.files.videoFile;

//     const supportedTypes = ['mp4','mkv','avi','webm'];

//     const filetype = file.name.split('.')[1];

//       if(!isFileTypeSupported(filetype,supportedTypes)){
//         throw new ApiError(400,'File type not supported');
//       }
      
//       const response = await uploadFileToCloudinary(file,'videos');

//       const newFile = await file.create({
//         name,
//         email,
//         path:response.secure_url,
//       })

//   } catch (error) {
//     throw new ApiError(400, error.message);
//   }
// }

// exports.imageSizeReducer = async (req, res) => {
//   try {
//     const { email} = req.body;

//     const file = req.files.file;

//     const supportedTypes = ['png','jpg','jpeg','gif','webp',];
//     const filetype = file.name.split('.')[1];
      
//         if(!isFileTypeSupported(filetype,supportedTypes)){
//           throw new ApiError(400,'File type not supported');
//         }
        
//         const response = await uploadFileToCloudinary(file,'images',30);
  
//         const newFile = await file.create({
//           name,
//           email,
//           path:response.secure_url,
//         })

//   } catch (error) {
//     throw new ApiError(400,error.message)
//   }
// }