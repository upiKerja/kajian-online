const path = require("path")
const fs = require("fs")
const supabase = require("../database/supabase");

function deleteStaticFile(filename) {
  // Normalisasi path biar ga bisa keluar dari directory
  const baseDir = path.join(process.cwd(), "public", "static");
  const targetPath = path.join(baseDir, filename);

  // Cek kalo file benaran ada di public/static/
  if (!targetPath.startsWith(baseDir)) {
    throw new Error("Invalid filename.");
  }

  // Hapus file kalo ada
  if (fs.existsSync(targetPath)) {
    fs.unlinkSync(targetPath);
    return true;
  } else {
    return false;
  }
}

function isSuccessStatusCode(statusCode) {
  return statusCode >= 200  && statusCode <= 400
}

function isValidReferer(referer) {
  if (!referer) {
    return false
  }
  let abadas = []
  process.env.CORS_ALLOWED_DOMAINS.split(",").forEach(
    domain => {if (referer.startsWith(domain)) abadas.push(true)}
  )
  return abadas.indexOf(true) != -1
}

function generateFileName(originalname) {
  const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
  const ext = path.extname(originalname);
  return `upi-${uniqueSuffix}${ext}`  
}

// Tambahin lagi fiturnya plis.
// Return true kalo ada error
function validateErrorFile(req, file) {
  if (!isValidReferer(req.headers.referer)) {
    console.log("RIJAL")
    file.error = {
      status: true,
      message: "Invalid header"
    }
    return true
  }

  return false
}

exports.baseHandlingChange = (fieldName) => {
  return async (req, res, next) => {
    if (!req.file) {
      return res.status(400).send(`Require field as file: ${fieldName}`)
    }
    if (req.file.is_upp) {
      req.body[fieldName] = req.file.id
      return next()
    } else {
      return res.status(400).send(req.file?.error)
    }
  } 
}

exports.baseAutoChange = (tableName, fieldName, idParamsValue) => {
  return async (req, res, next) => {
    if (req.file?.is_upp) {
      req.body[fieldName] = req.file.id
      let response = await supabase.client
        .from(tableName)
        .update(req.body)
        .eq(idParamsValue, req.params[idParamsValue])

      if (isSuccessStatusCode(response.status)) {
        res.status(response.status).send(response)
      }
      
    } else if(req.file?.error) {
      return res.status(400).send(req.file.error)
    } else {
      return res.status(403).send("Invalid Request")
    }

  }
}

exports.uppsertFileMiddleware = async (req, file, cb) => {
  const id_file = (
    req.abudabas?.id_static_file_address || 
    req.params?.id_static_file_address ||
    req.params?.id_file ||
    false
  )
  
  if (validateErrorFile(req, file)) {
    return cb(null, false)
  }

  const filename = generateFileName(file.originalname)
  const prevFile = await supabase.client
    .from("static_file_address")
    .select("filename")
    .eq("id_static_file_address", id_file)
    .single()

  if (isSuccessStatusCode(prevFile.status)) {
    console.log("Deleting: ", prevFile.data.filename)
    deleteStaticFile(prevFile.data.filename)
  } else {
    file.error = {
      status: true,
      message: "The server does not contains previous file."
    }
    return cb(null, false)
  }

  const response = await supabase.client
    .from("static_file_address")
    .update({
      filename: filename,
      path: "/static/" + filename
    })
    .eq("id_static_file_address", id_file)
    .select("path, filename")
  
  if (response.status >= 200 && response.status <= 400) {
    file.is_upp = true;
    file.id = id_file,
    file.name = filename,
    file.path = "/static/" + filename

    cb(null, true)

    console.log(response.data)

  } else {
    file.error = {
      status: true,
      message: "Failed to store to the database."
    }
    cb(null, false)
  }

}

// Aku Sego
exports.upploadFileMiddleware = async (req, file, cb) => {
  console.log("Uppload Instead")
  if (validateErrorFile(req, file)) {
    return cb(null, false)
  }

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