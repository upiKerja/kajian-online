var jwt = require("jsonwebtoken")
var exports = module.exports = {}
var supabase = require("../database/supabase").client
var cache = require("./cache").get_or_set_for_auth

exports.auth = async (req, res, next) => {
  try {
    const user = jwt.verify(req.cookies.access_token, process.env.SUPABASE_JWT_KEY);

    const { data, error } = await supabase
      .from("pengguna")
      .select("id_pengguna")
      .eq("id_pengguna", user.sub)
      .single();

    if (error || !data) {
      return res.status(401).send({ msg: "User not found", error: error ? error.message : "No data" });
    }

    req.user = user.user_metadata,
    req.internalUserId = data.id_pengguna;

    next();

  } catch (err) {
    return res.status(401).send({
      msg: "access_token is required or invalid",
      error: err.message || err,
    });
  }
};

exports.auth_mentor = async (req, res, next) => {
  try {
    const user = jwt.verify(req.cookies.access_token, process.env.SUPABASE_JWT_KEY);
    const role = await cache(req, user.sub, async () => {
        console.log("ngirimjir")
        return await supabase
        .from("pengguna")
        .select("role")
        .eq("id_pengguna", user.sub)
        .single()
    })

    if (!role) {
      return res.status(401).send({ msg: "User not found", error: error ? error.message : "No data" });
    }

    if (role === "biasa") {
      return res.status(403).send("<h1>403 Forbidden</h1>");
    }

    req.user = user.user_metadata,
    req.internalUserId = "id_pengguna";
    next();

  } catch (err) {
    console.error("auth_mentor error:", err);
    return res.status(401).send({
      msg: "access_token is required or invalid",
      error: err.message || err,
    });
  }
};

exports.auth_admin = async (req, res, next) => {
  try {
    const user = jwt.verify(req.cookies.access_token, process.env.SUPABASE_JWT_KEY);
    const role = await cache(req, user.sub, async () => {
        console.log("ngirimjir")
        return await supabase
        .from("pengguna")
        .select("role")
        .eq("id_pengguna", user.sub)
        .single()
    })

    if (!role) {
      return res.status(401).send({ msg: "User not found", error: error ? error.message : "No data" });
    }

    if (role !== "admin") {
      return res.status(403).send("<h1>403 Forbidden</h1>");
    }

    req.user = user.user_metadata,
    req.internalUserId = "id_pengguna";
    next();

  } catch (err) {
    console.error("auth_mentor error:", err);
    return res.status(401).send({
      msg: "access_token is required or invalid",
      error: err.message || err,
    });
  }
};