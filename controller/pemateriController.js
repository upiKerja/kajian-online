var exports = module.exports = {}
var supabase = require("../database/supabase")

// Get all data
exports.carisemua = async (req, res, next) => {
    const { data, error } = await supabase.client
        .from("pemateri")
        .select("*")

    if (data) {
        res.status(200).send(data)
    }
}

// Get data by nama lengkap
exports.cari = async (req, res, next) => {
    const { data, error } = await supabase.client
        .from("pemateri")
        .select("*")
        .limit(10)
        .textSearch("nama_lengkap", req.query.q, {
            type: "websearch",
            config: "english"
        })

    if (data) {
        res.status(200).send(data)
    }
}

exports.select = async (req, res) => {
    const { error, data } = await supabase.client
    .from("pemateri")
    .select("*")
    .eq(req.query.w, req.query.eq)

    if (data) {
        res.send(data)
    } else {
        res.send({error: error})
    }
}

exports.insert = async (req, res) => {
    const { data, error } = await supabase.client
        .from("pemateri")
        .insert([req.body])
        .single()
        .select("*")

    if (error) {
        return res.status(201).send({ info: "success", data });
    }
    return res.status(201).send({ info: "success", data });
}

exports.delete = async (req, res) => {
    const { data, error } = await supabase.client
        .from("pemateri")
        .delete()
        .eq("id_pemateri", req.params.id) // Delete row where id matches
        .select("*")

    if (error) {
        return res.status(400).send({ error: error.message });
    }
    return res.status(200).send({ info: "success", data });
};