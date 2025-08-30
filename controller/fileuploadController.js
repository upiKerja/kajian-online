const multer = require("multer");
const path = require("path");
const fs = require("fs");

// ----------------- TEMP UPLOAD -----------------
const tempStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public/static/");
  },
  filename: (req, file, cb) => {
    if (!req.internalUserId) return cb(new Error("User ID missing"), null);

    const ext = path.extname(file.originalname);
    const filename = `${req.internalUserId}_temp${ext}`;

    const filepath = path.join("public/static", filename);
    if (fs.existsSync(filepath)) fs.unlinkSync(filepath); // replace old temp
    cb(null, filename);
  },
});

const tempUpload = multer({ storage: tempStorage });

exports.tempUploadMiddleware = tempUpload.single("file");

exports.tempUploadFile = (req, res) => {
  if (!req.file) return res.status(400).json({ message: "No file uploaded" });

  res.json({
    message: "Temp file uploaded",
    filename: `/static/${req.file.filename}`,
    id_pengguna: req.internalUserId,
  });
};

// ----------------- COMMIT TEMP TO MAIN (_pp) -----------------
exports.commitTempFile = (req, res) => {
  let filename = req.body.filename;
if (!filename) return res.status(400).json({ message: "Missing info" });
  if (!req.internalUserId || !filename) 
    return res.status(400).json({ message: "Missing info" });

  filename = filename.replace(/^\/static\//, '');
  const tempFile = path.join("public/static", filename);
  const ext = path.extname(filename);
  const mainFile = path.join("public/static", `${req.internalUserId}_pp${ext}`);

  if (!fs.existsSync(tempFile)) 
    return res.status(404).json({ message: "Temp file not found" });

  // Remove old main file if exists
  if (fs.existsSync(mainFile)) fs.unlinkSync(mainFile);

  // Rename temp → main
  fs.renameSync(tempFile, mainFile);

  res.json({ message: "Profile picture committed", filename: `${req.internalUserId}_pp${ext}` });
};

// ----------------- TEMP THUMBNAIL UPLOAD -----------------
const tempThmbnailStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public/static/");
  },
  filename: (req, file, cb) => {
    // just give random name for now
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const tempThumbnailUpload = multer({ storage: tempThmbnailStorage });

exports.tempThumbnailUploadMiddleware = tempThumbnailUpload.single("file");

exports.tempThumbnailUploadFile = (req, res) => {
  const internalDonasiId = req.body.InternalDonasiId || req.internalDonasiId;
  if (!internalDonasiId) {
    return res.status(400).json({ error: "InternalDonasiId missing" });
  }

  const ext = path.extname(req.file.originalname);
  const newFilename = `${internalDonasiId}_tempthumbnail${ext}`;
  const newPath = path.join("public/static", newFilename);

  // remove old if exists
  if (fs.existsSync(newPath)) fs.unlinkSync(newPath);

  fs.renameSync(req.file.path, newPath);

  res.json({ filename: newFilename});
};

// ----------------- COMMIT TEMP-THMBNAIL TO MAIN (_thumbnail) -----------------
exports.commitTempThumbnailFile = (req, res) => {
  let { filename, InternalDonasiId } = req.body;
  if (!filename || !InternalDonasiId) {
    return res.status(400).json({ message: "Missing info" });
  }

  filename = filename.replace(/^\/static\//, '');
  const tempFile = path.join("public/static", filename);
  const ext = path.extname(filename);
  const mainFile = path.join("public/static", `${InternalDonasiId}_thumbnail${ext}`);

  if (!fs.existsSync(tempFile)) {
    return res.status(404).json({ message: "Temp file not found" });
  }

  // Remove old main file if exists
  if (fs.existsSync(mainFile)) fs.unlinkSync(mainFile);

  // Rename temp → main
  fs.renameSync(tempFile, mainFile);

  // TODO: save new thumbnail URL into DB here if needed
  res.json({ message: "Thumbnail committed", filename: `${InternalDonasiId}_thumbnail${ext}` });
};