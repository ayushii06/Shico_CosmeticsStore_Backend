const express = require("express");
const router = express.Router();
const { localfileUpload } = require("../controller/fileCtrl");
// const { fetchuser } = require("../middlewares/fetchuser");
// const { uploadPhoto, productImgResize } = require("../middlewares/uploadImage");


router.post('/localfileupload',localfileUpload);

module.exports = router;