var exports = module.exports = {}
var supabase = require("../database/supabase")

// Get All
exports.carisemua = async (req, res, next) => {
    const { data } = await supabase.client
        .from("kajian")
        .select("*")

    if (data) {
        res.status(200).send(data)
    }
}

// Get by Judul
exports.cari = async (req, res, next) => {
    const { data } = await supabase.client
        .from("kajian")
        .select("*")
        .limit(10)
        .textSearch("judul", req.query.q, {
            type: "websearch",
            config: "english"
        })

    if (data) {
        res.status(200).send(data)
    }
}

// Get by column
exports.select = async (req, res) => {
    const { error, data } = await supabase.client
    .from("kajian")
    .select("*")
    .eq(req.query.w, req.query.eq)

    if (data) {
        res.send(data)
    } else {
        res.send({error: error})
    }
}

// Post data
exports.insert = async (req, res) => {
    const { data, error } = await supabase.client
        .from("kajian")
        .insert([req.body])
        .single()
        .select("*")

    if (error) {
        return res.status(400).send({ msg: "failed", error: error });
    }
    return res.status(201).send({ info: "success", data });
}

// Delete data by id
exports.delete = async (req, res) => {
    const { data, error } = await supabase.client
        .from("kajian")
        .delete()
        .eq("id_kajian", req.params.id)
        .select("*")

    if (error) {
        return res.status(400).send({ error: error.message });
    }
    return res.status(200).send({ info: "success", data });
};