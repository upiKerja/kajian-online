var exports = module.exports = {}
var supabase = require("../database/supabase")
var table = "mentor_form"
var table_id = "id_" + table

exports.carisemua = async (req, res, next) => {
    const { data, error } = await supabase.client
        .from(table)
        .select("*, pengguna(*)")

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

exports.insert = async (req, res, next) => {
    req.body.id_pengguna = req.internalUserId
    req.abudabi = await supabase.client
        .from(table)
        .insert(req.body)
        .select("*")
        .single()

    return res.status(req.abudabi.status).send(req.abudabi)
}

exports.update = async (req, res, next) => {
    req.abudabi = await supabase.client
        .from(table)
        .update(req.body)
        .eq(table_id, req.params.id_mentor_form)
        .single()

    res.status(req.abudabi.status).send(req.abudabi)
    next()
}


exports.delete = async (req, res, next) => {
    req.abudabi = await supabase.client
        .from(table)
        .delete()
        .eq(table_id, req.params.id_mentor_form)
        .single()

    res.status(req.abudabi.status).send(req.abudabi)
    next()
};