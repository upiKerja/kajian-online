var jwt = require("jsonwebtoken")
var exports = module.exports = {}
var supabase = require("../database/supabase").client
var cache = require("./cache").get_or_set_for_auth

const baseAuth = async (req, res, next, roleCheck = null) => {
  try {
    const user = jwt.verify(req.cookies.access_token, process.env.SUPABASE_JWT_KEY);
    
    const role = await cache(req, user.sub, async () => {
      return await supabase
        .from("pengguna")
        .select("role")
        .eq("id_pengguna", user.sub)
        .single()
    })

    if (!role) {
      return res.status(401).send({ 
        msg: "User not found", 
        error: "No data" 
      });
    }

    if (roleCheck) {
      const isAllowed = roleCheck(role);
      if (!isAllowed) {
        return res.status(403).send("<h1>403 Forbidden</h1>");
      }
    }

    req.user = user.user_metadata;
    req.internalUserId = user.sub;
    req.userRole = role;
    next();

  } catch (err) {
    console.error("auth error:", err);
    return res.status(401).send({
      msg: "access_token is required or invalid",
      error: err.message || err,
    });
  }
};

exports.auth = (req, res, next) =>
  baseAuth(req, res, next);

exports.auth_mentor = (req, res, next) => 
  baseAuth(req, res, next, (role) => role !== "biasa");

exports.auth_admin = (req, res, next) => 
  baseAuth(req, res, next, (role) => role === "admin");

// Middleware setelah auth_mentor.
exports.authenticated_mentor = async (req, res, next) => {
  if (!req.params.id_kelas || req.userRole === "admin") {
    return next()
  }

  // Biar up to date.
  let response = await supabase
    .from("kelas")
    .select("id_mentor")
    .eq("id_kelas", req.params.id_kelas)
    .single()

  if (response.data.id_mentor === req.internalUserId) {
    console.log("rijal")
    return next()
  }

  res.status(403).send({
    message: "Invalid credentials"
  })
}