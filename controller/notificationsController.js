var exports = module.exports = {}
var supabase = require("../database/supabase")
var table = "notifications"
var table_id = "id_" + table

// User endpoints
exports.my = async (req, res) => {
    const response = await supabase.client
        .from(table)
        .select("*")
        .eq("id_pengguna", req.internalUserId)
        .order("created_at", { ascending: false })

    return res.status(response.status).send(response)
}

exports.markRead = async (req, res) => {
    const response = await supabase.client
        .from(table)
        .update({ is_read: true, read_at: new Date().toISOString() })
        .eq(table_id, req.params.id_notification)
        .eq("id_pengguna", req.internalUserId)
        .select("*")

    return res.status(response.status).send(response)
}

// Admin endpoints
exports.carisemua = async (req, res) => {
    const response = await supabase.client
        .from(table)
        .select("*")
        .order("created_at", { ascending: false })

    return res.status(response.status).send(response)
}

exports.select = async (req, res) => {
    const response = await supabase.client
        .from(table)
        .select("*")
        .eq(req.query.w, req.query.eq)

    return res.status(response.status).send(response)
}

exports.insert = async (req, res) => {
    const response = await supabase.client
        .from(table)
        .insert(req.body)
        .select("*")

    return res.status(response.status).send(response)
}

exports.update = async (req, res) => {
    const response = await supabase.client
        .from(table)
        .update(req.body)
        .eq(table_id, req.params.id_notification)
        .select("*")

    return res.status(response.status).send(response)
}

exports.delete = async (req, res) => {
    const response = await supabase.client
        .from(table)
        .delete()
        .eq(table_id, req.params.id_notification)
        .select("*")

    return res.status(response.status).send(response)
}


