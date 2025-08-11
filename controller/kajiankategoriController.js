var exports = module.exports = {}
var supabase = require("../database/supabase")
var table = "kajian_kategori"
var table_id = "id_" + table

exports.carisemua = async (req, res, next) => {
    const { data, error } = await supabase.client
        .from(table)
        .select("*")

    if (!data || (Array.isArray(data) && !data.length)) {
        return res.status(200).send({
            message: "success",
            status: "success",
            data: data
        })
    }
    return res.status(404).send({
        message: "data tidak ditemukan",
        status: "failed",
        error: error
    })
}

exports.cari = async (req, res, next) => {
    const { data, error } = await supabase.client
        .from(table)
        .select("*")
        .limit(10)
        .textSearch("nama", req.query.q, {
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
        error: data
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
        error: data
    })
}

exports.indexes = async (req, res) => {
    const { data, error } = await supabase.client
        .from(table)
        .select("*, kajian(*)")
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
        error: data
    })
}

exports.update = async (req, res) => {
    const { data, error } = await supabase.client
        .from(table)
        .update(req.body)
        .eq(table_id, req.params.id)

    if (!error) {
        return res.status(200).send({
            message: "success",
            status: "success",
            data: data
        })
    }
    return res.status(404).send({
        message: "data tidak ditemukan",
        status: "failed",
        error: error
    })
}

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