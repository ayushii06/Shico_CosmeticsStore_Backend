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
        res.status(500).json({
          success:false,
          message:'Error in uploading file'
      })
      }
    });

    return res.status(200).json({
      success:true,
      message:'File Uploaded Successfully'
    });
  } catch (error) {
    res.status(400).json({
      success:false,
      message:error.message
  })
  }
}



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

