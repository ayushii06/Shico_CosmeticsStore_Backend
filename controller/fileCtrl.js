const { ApiError } = require("../middlewares/ApiError");
const { ApiSuccess } = require("../middlewares/apiSuccess");
const file = require("../models/File");
const cloudinary = require("cloudinary").v2;


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

function isFileTypeSupported(type,supportedTypes){
  return supportedTypes.includes(type);
}

async function uploadFileToCloudinary(file,folder,quality){
    const options = {folder};
    options.resource_type = 'auto';
    if(quality) options.quality = quality;
    return await cloudinary.uploader.upload(file.tempFilePath,options);
}

exports.imageUpload = async (req, res) => {
    try {
      const {name , email} = req.body;

      const file = req.files.file;

      //now validate 

      const supportedTypes = ['png','jpg','jpeg','gif','webp',];
      const filetype = file.name.split('.')[1];

      if(!isFileTypeSupported(filetype,supportedTypes)){
        throw new ApiError(400,'File type not supported');
      }
      
      const response = await uploadFileToCloudinary(file,'images');

      const newFile = await file.create({
        name,
        email,
        path:response.secure_url,
      })
    } catch (error) {
      throw new ApiError(500, error.message);
    }
}

exports.videoUpload = async (req, res) => {
  try {
    const {name , email} = req.body;

    const file = req.files.videoFile;

    const supportedTypes = ['mp4','mkv','avi','webm'];

    const filetype = file.name.split('.')[1];

      if(!isFileTypeSupported(filetype,supportedTypes)){
        throw new ApiError(400,'File type not supported');
      }
      
      const response = await uploadFileToCloudinary(file,'videos');

      const newFile = await file.create({
        name,
        email,
        path:response.secure_url,
      })

  } catch (error) {
    throw new ApiError(400, error.message);
  }
}

exports.imageSizeReducer = async (req, res) => {
  try {
    const {name , email} = req.body;

  } catch (error) {
    throw new ApiError(400,error.message)
  }
}