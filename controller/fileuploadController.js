const multer = require("multer");
const path = require("path");
const fs = require("fs");
const supabase = require("../database/supabase")

const anggap_aja_ini_middleware = async (req, file, cb) => {
  let abadas = []
  req.astungkara = {}
  process.env.CORS_ALLOWED_DOMAINS.split(",").forEach(
    (domain) => {
    if (req.headers.referer.startsWith(domain)) abadas.push(true)})
  if (
    abadas.indexOf(true) != -1 &&
    req.headers.referer &&
    req.headers["content-length"] <= 6 * 1_000_000 // Max 5 MB
  ) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    const filename = `upi-${uniqueSuffix}${ext}`

    let fileData = {
      filename: filename,
      path: "/static/" + filename,
      assigner: req.internalUserId,
      field: file.fieldname
    }
    const response = await supabase.client
      .from("static_file_address")
      .insert(fileData)
      .select("id_static_file_address")
      .single()

    file.is_upp = true;
    file.id = response.data.id_static_file_address
    file.name = filename
    file.path = "/static/" + filename

    cb(null, true)
  }
  cb(null, false)
}

const main_storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public/static/")
  },
  filename: (req, file, cb) => {
    const filename = file.name
    cb(null, filename);
  }
})
exports.main_uploader = multer({
  storage: main_storage,
  fileFilter: anggap_aja_ini_middleware
})

exports.main_upp_middleware = this.main_uploader.single("file")
exports.main_upp = async (req, res) => {
  return res.json([req.headers, req.file])
}

// ----------------- Profile TEMP UPLOAD -----------------
const tempStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public/static/");
  },
  filename: (req, file, cb) => {
    if (!req.internalUserId) return cb(new Error("User ID missing"), null);

    const dir = "public/static";
    const userId = req.internalUserId;

    // Remove any existing temp file for this user, regardless of extension
    const pattern = new RegExp(`^${userId}_temp\\..+$`); 
    fs.readdirSync(dir).forEach(f => {
      if (pattern.test(f)) {
        fs.unlinkSync(path.join(dir, f));
      }
    });

    // Save new file with original extension
    const ext = path.extname(file.originalname);
    const filename = `${userId}_temp${ext}`;
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

// ----------------- Profile COMMIT TEMP TO MAIN (_pp) -----------------
exports.commitTempFile = (req, res) => {
  let filename = req.body.filename;
  const userId = req.internalUserId;

  if (!filename || !userId) 
    return res.status(400).json({ message: "Missing info" });

  filename = filename.replace(/^\/static\//, '');
  const tempFile = path.join("public/static", filename);
  const ext = path.extname(filename);
  const mainFile = path.join("public/static", `${userId}_pp${ext}`);

  if (!fs.existsSync(tempFile)) 
    return res.status(404).json({ message: "Temp file not found" });

  // Delete any old profile picture for this user, regardless of extension
  const dir = "public/static";
  const pattern = new RegExp(`^${userId}_pp\\..+$`);
  fs.readdirSync(dir).forEach(f => {
    if (pattern.test(f)) {
      fs.unlinkSync(path.join(dir, f));
    }
  });

  // Rename temp → main
  fs.renameSync(tempFile, mainFile);

  res.json({ message: "Profile picture committed", filename: `${userId}_pp${ext}` });
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
  const InternalId = req.body.InternalId || req.InternalId;
  if (!InternalId) {
    return res.status(400).json({ error: "InternalId missing" });
  }

  const ext = path.extname(req.file.originalname);
  const newFilename = `${InternalId}_tempthumbnail${ext}`;
  const newPath = path.join("public/static", newFilename);

  // remove old if exists
  if (fs.existsSync(newPath)) fs.unlinkSync(newPath);

  fs.renameSync(req.file.path, newPath);

  res.json({ filename: newFilename});
};

// ----------------- COMMIT TEMP-THMBNAIL TO MAIN (_thumbnail) -----------------
exports.commitTempThumbnailFile = (req, res) => {
  let { filename, InternalId } = req.body;
  if (!filename || !InternalId) {
    return res.status(400).json({ message: "Missing info" });
  }

  filename = filename.replace(/^\/static\//, '');
  const tempFile = path.join("public/static", filename);
  const ext = path.extname(filename);
  const mainFile = path.join("public/static", `${InternalId}_thumbnail${ext}`);

  if (!fs.existsSync(tempFile)) {
    return res.status(404).json({ message: "Temp file not found" });
  }

  // Remove old main file if exists
  if (fs.existsSync(mainFile)) fs.unlinkSync(mainFile);

  // Rename temp → main
  fs.renameSync(tempFile, mainFile);

  // TODO: save new thumbnail URL into DB here if needed
  res.json({ message: "Thumbnail committed", filename: `${InternalId}_thumbnail${ext}` });
};
