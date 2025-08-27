var express = require("express");
var router = express.Router();
var fileuploadController = require("../controller/fileuploadController");

router.post("/upload", fileuploadController.uploadMiddleware, fileuploadController.uploadFile);

module.exports = router;