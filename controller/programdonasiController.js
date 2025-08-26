var exports = module.exports = {}
var supabase = require("../database/supabase")
var table = "program_donasi"
var table_id = "id_" + table

exports.carisemua = async (req, res, next) => {
    const response = await supabase.client
        .from(table)
        .select("*")

    return res.status(response.status).send(response)
}

exports.discover = async (req, res) => {
    const response = await supabase.client
        .from(table)
        .select("nama_program, slug, id_program_donasi, deskripsi")
        .limit(req.query.limit || 20)

    return res.status(response.status).send(response)
}

exports.cari = async (req, res, next) => {
    const response = await supabase.client
        .from(table)
        .select("nama_program, slug, id_program_donasi, deskripsi")
        .eq("is_accepted", true)
        .limit(10)
        .textSearch("nama_program", req.query.q, {
            type: "websearch",
            config: "english"
        })

    return res.status(response.status).send(response)
}

exports.select = async (req, res) => {
    const response = await supabase.client
        .from(table)
        .select("*")
        .eq(req.query.w, req.query.eq)

    return res.status(response.status).send(response)
}

exports.indexes = async (req, res) => {
    const response = await supabase.client
        .from(table)
        .select("*")
        .single()
        .eq("slug", req.params.slug)

    return res.status(response.status).send(response)
}

exports.update = async (req, res) => {
    if (req.body.nama_program) {
        req.body.slug = req.body.nama_program.replace(/[?&]/g, "").toLowerCase().trim().replaceAll(" ", "-")
    }

    const response = await supabase.client
        .from(table)
        .update(req.body)
        .eq(table_id, req.params.id_program_donasi)

    return res.status(response.status).send(response)
}


exports.insert = async (req, res) => {
    if (req.body.nama_program) {
        req.body.slug = req.body.nama_program.replace(/[?&]/g, "").toLowerCase().trim().replaceAll(" ", "-")
    }

    const response = await supabase.client
        .from(table)
        .insert(req.body)
        .select("*")

    return res.status(response.status).send(response)
}

exports.delete = async (req, res) => {
    const response = await supabase.client
        .from(table)
        .delete()
        .eq(table_id, req.params.id)
        .select("*")

    return res.status(response.status).send(response)
};

exports.donasi = async (req, res) => {
    const response = await supabase.client
        .from("donasi")
        .insert({
            id_pengguna: req.internalUserId,
            id_program_donasi: req.params.id_program_donasi,
            nominal: req.body.nominal
        })

    return res.status(response.status).send(response)
}

exports.inspect = async (req, res) => {
    const response = await supabase.client
        .from("donasi")
        .select("nominal, pengguna(nama_lengkap)", { count: "exact" })
        .eq("id_program_donasi", req.params.id_program_donasi)

    let result = 0;
    let donatur = [];    
    if (response.count > 1) {
        response.data.forEach(el => {
            result += el.nominal
            donatur.push(el.pengguna.nama_lengkap)
        })
        response.data = {
            terkumpul: result,
            donatur: [...new Set(donatur)]
        }
    } else {
        response.status = 404
        response.statusText = "Not Found"
    }

    return res.status(response.status).send(response)        
}