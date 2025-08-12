var exports = module.exports = {}
var supabase = require("../database/supabase")
var table = "pengguna"
var table_id = "id_" + table

exports.carisemua = async (req, res, next) => {
    const { data, error } = await supabase.client
        .from(table)
        .select("*")

    if (data === null || (Array.isArray(data) && data.length === 0)) {
        return res.status(404).send({
            message: "data tidak ditemukan",
            status: "failed",
            error: error
        })
    }
    return res.status(200).send({
        message: "success",
        status: "success",
        data: data
    })
}

exports.cari = async (req, res, next) => {
    const { data, error } = await supabase.client
        .from(table)
        .select("*")
        .limit(10)
        .textSearch("nama_lengkap", req.query.q, {
            type: "websearch",
            config: "english"
        })

    if (data === null || (Array.isArray(data) && data.length === 0)) {
        return res.status(404).send({
            message: "data tidak ditemukan",
            status: "failed",
            error: error
        })
    }
    return res.status(200).send({
        message: "success",
        status: "success",
        data: data
    })
}

exports.select = async (req, res) => {
    const { error, data } = await supabase.client
    .from(table)
    .select("*")
    .eq(req.query.w, req.query.eq)

    if (data === null || (Array.isArray(data) && data.length === 0)) {
        return res.status(404).send({
            message: "data tidak ditemukan",
            status: "failed",
            error: error
        })
    }
    return res.status(200).send({
        message: "success",
        status: "success",
        data: data
    })
}

exports.indexes = async (req, res) => {
    const { data, error } = await supabase.client
        .from(table)
        .select("*")
        .limit(1)
        .eq("slug", req.params.slug)

    if (data === null || (Array.isArray(data) && data.length === 0)) {
        return res.status(404).send({
            message: "data tidak ditemukan",
            status: "failed",
            error: error
        })
    }
    return res.status(200).send({
        message: "success",
        status: "success",
        data: data[0]
    })
}

exports.update = async (req, res) => {
  try {
    const { data, error } = await supabase.client
      .from(table)
      .update(req.body)
      .eq(table_id, req.params.id)
      .select(); // to get updated data

    if (error) {
      return res.status(404).send({
        message: "data tidak ditemukan",
        status: "failed",
        error: error,
      });
    }

    // Access Redis client
    const redis = req.app.locals.redis;

    if (redis && redis.isOpen) {
      // Assume req.params.id is user ID (id_pengguna)
      const userId = req.params.id;
      const deleted = await redis.del(userId);
      console.log(deleted ? `Cache invalidated: ${userId}` : `No cache found for: ${userId}`);

    } else {
      console.warn("Redis not connected. Cache not invalidated.");
    }

    return res.status(200).send({
      message: "success",
      status: "success",
      data: data,
    });
  } catch (err) {
    console.error("Update error:", err);
    return res.status(500).send({
      message: "Internal server error",
      status: "failed",
      error: err.message || err,
    });
  }
};


exports.insert = async (req, res) => {
    const { data, error } = await supabase.client
        .from(table)
        .insert([req.body])
        .single()
        .select("*")

    if (error) {
        return res.status(400).send({
            message: error.message,
            status: "failed",
            error: error
        });
    }
    return res.status(201).send({ info: "success", data });
}

exports.delete = async (req, res) => {
    const { data, error } = await supabase.client
        .from(table)
        .delete()
        .eq(table_id, req.params.id)
        .select("*")

    if (error) {
        return res.status(400).send({
            message: error.message,
            status: "failed",
            error: error
        });
    }
    return res.status(200).send({
        message: "success",
        status: "success",
        data : data});
};