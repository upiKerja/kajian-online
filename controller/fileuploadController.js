const path = require("path");
const multer = require("multer");
const { v4: uuidv4 } = require("uuid");

exports.uploadFile = (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: "No file uploaded" });
  }

  const filePath = `/static/${req.file.filename}`;
  const endpointInfo = `${req.method} ${req.baseUrl}${req.path}/${req.file.originalname}`;

  res.json({
    message: "File uploaded successfully",
    endpoint: endpointInfo,
    url: filePath,
  });
};

const storage = multer.diskStorage({
  destination: (_, __, cb) => cb(null, "public/static"),
  filename: (_, file, cb) => cb(null, uuidv4() + path.extname(file.originalname)),
});

const upload = multer({ storage });
exports.uploadMiddleware = upload.single("file");
