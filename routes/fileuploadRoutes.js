const express = require("express");
const router = express.Router();
const fileController = require("../controller/fileuploadController");
const authMiddleware = require("../middleware/auth"); // assuming you have auth

// ---------------- TEMP UPLOAD ----------------
// Upload a temporary file (_temp)
router.post(
  "/temp-upload",
  authMiddleware.auth,          // must be logged in
  fileController.tempUploadMiddleware,
  fileController.tempUploadFile
);

// ---------------- COMMIT TEMP TO MAIN ----------------
// Commit the temp file to main profile picture (_pp)
router.post(
  "/commit-temp",
  authMiddleware.auth,
  fileController.commitTempFile
);

module.exports = router;
