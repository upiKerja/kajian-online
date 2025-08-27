const path = require("path");
const multer = require("multer");
const { v4: uuidv4 } = require("uuid");
const fs = require("fs");
const axios = require("axios");

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

exports.uploadFromUrl = async (req, res) => {
  const { url } = req.body;
  if (!url) {
    return res.status(400).json({ error: "No URL provided" });
  }

  try {
    const response = await axios.get(url, { responseType: "arraybuffer" });

    const contentType = response.headers["content-type"];
    let ext = ".jpg";
    if (contentType === "image/png") ext = ".png";
    else if (contentType === "image/jpeg") ext = ".jpg";
    else if (contentType === "image/gif") ext = ".gif";

    const filename = uuidv4() + ext;
    const savePath = path.join("public/static", filename);

    fs.writeFileSync(savePath, response.data);

    res.json({
      message: "File downloaded successfully",
      url: `/static/${filename}`,
      sourceUrl: url,
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: "Failed to fetch image" });
  }
};


const upload = multer({ storage });
exports.uploadMiddleware = upload.single("file");

