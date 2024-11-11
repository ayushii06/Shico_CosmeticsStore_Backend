const express = require("express");
const router = express.Router();
const { localfileUpload } = require("../controller/fileCtrl");

router.post('/localfileupload',localfileUpload);

module.exports = router;