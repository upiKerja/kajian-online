var exports = module.exports = {}
var supabase = require("../database/supabase")

exports.carisemua = async (req, res, next) => {
    const { data, error } = await supabase.client
        .from("pemateri")
        .select("*")

    if (error) {
        return res.status(500).send({ error: error.message });
    }

    if (data) {
        res.status(200).send(data)
    }
}

exports.cari = async (req, res, next) => {
    const { data, error } = await supabase.client
        .from("pemateri")
        .select("*")
        .limit(10)
        .textSearch("nama", req.query.q, {
            type: "websearch",
            config: "english"
        })
    if (error) {
        return res.status(500).send({ error: error.message });
    }

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
    const { error } = await supabase.client
        .from("pemateri")
        .update(req.body)
    if (!error) {
        return res.status(201).send({info: "success"})    
    }
}

exports.delete = async (req, res) => {
    const { error } = await supabase.client
        .from("pemateri")
        .update(req.body)
    if (!error) {
        return res.status(200).send({info: "success"})
    }        
}