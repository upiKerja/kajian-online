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
        .select("*, pengguna(nama_lengkap, foto_url, id_pengguna)")
        .limit(1)
        .eq("slug", req.params.slug_kajian)

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
    // Route khusus Authenticated User
    
    // Role gaboleh di Update
    const {role, ...inih} = req.body
    req.body = inih

    const response = await supabase.client
        .from(table)
        .update(req.body)
        .eq(table_id, req.internalUserId)

    if (!response.error) {
        return res.status(response.status).send({
            message: response.statusText,
            status: "success",
            data: response.data
        })
    }
    return res.status(response.status).send({
        message: response.statusText,
        status: "failed",
        error: response.error
    })
}

exports.delete = async (req, res) => {
    const response = await supabase.client
        .from(table)
        .delete()
        .eq(table_id, req.params.internalUserId)
        .select("*")

    if (response.error) {
        return res.status(400).send({
            message: response.statusText,
            status: "failed",
            error: response.error
        });
    }
    return res.status(response.status).send({
        message: "success",
        status: "success",
        data : response.data});
};

exports.setRole = async (req, res) => {
    const response = await supabase.client
        .from(table)
        .update({role: req.body.role})
        .eq(table_id, req.params.id_pengguna)

    if (!response.error) {
        return res.status(response.status).send({
            message: response.statusText,
            status: "success",
            data: response.data
        })
    }
    return res.status(response.status).send({
        message: response.statusText,
        status: "failed",
        error: response.error
    })
}