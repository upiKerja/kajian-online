var exports = module.exports = {}
var supabase = require("../database/supabase")
var table = "kajian"
var table_id = "id_" + table

exports.carisemua = async (req, res, next) => {
    const { data, error } = await supabase.client
        .from(table)
        .select("*, kajian_kategori(slug, nama)")

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

exports.meta = async (req, res) => {
    const response = await supabase.client
        .from(table)
        .select("judul, deskripsi, thumbnail_url, deskripsi_lengkap")
        .eq("slug", req.params.slug_kajian)
        .single()

    if (response.status != 200) {
        response.status = 404
    }
    return res.status(response.status).send(response)

}

exports.cari = async (req, res, next) => {
    const { data, error } = await supabase.client
        .from(table)
        .select("*, kajian_kategori(slug, nama)")
        .limit(10)
        .textSearch("judul", req.query.q, {
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
    const response = await supabase.client
        .from(table)
        .select("*")
        .eq("slug", req.params.slug_kajian)
        .single()

    return res.status(response.status).send(response)
}

exports.discover = async (req, res) => {
    const response = await supabase.client
        .from(table)
        .select("*")
        .limit(req.query.limit || 20)

    return res.status(response.status).send(response)
}

exports.update = async (req, res, next) => {
    req.abudabi = await supabase.client
        .from(table)
        .update(req.body)
        .eq(table_id, req.params.id_kajian)
        .select("slug")
        .single()

    res.status(req.abudabi.status).send(req.abudabi)
    next()
}

exports.insert = async (req, res, next) => {
    if (req.body.judul) {
        req.body.slug = req.body.judul.replace(/[?&]/g, "").toLowerCase().trim().replaceAll(" ", "-")
    } 
    
    req.abudabi = await supabase.client
        .from(table)
        .insert(req.body)
        .select("slug")
        .single()

    res.status(req.abudabi.status).send(req.abudabi)
    next()
}

exports.delete = async (req, res) => {
    req.abudabi = await supabase.client
        .from(table)
        .delete()
        .eq(table_id, req.params.id_kajian)
        .select("slug")
        .single()

    res.status(req.abudabi.status).send(req.abudabi)
    next()
};