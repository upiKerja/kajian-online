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
        .select("nama_program, slug, id_program_donasi, deskripsi, gambar")
        .limit(req.query.limit || 20)

    return res.status(response.status).send(response)
}

exports.accept = async (req, res, next) => {
    req.abudabi = await supabase.client
        .from(table)
        .update({is_accepted: true})
        .eq("id_program_donasi", req.params.id_program_donasi)

    res.status(req.abudabi.status).send(req.abudabi)
    next()
}

exports.cari = async (req, res, next) => {
    let response = supabase.client
        .from(table)
        .select("*")
        .limit(10)
        .textSearch("nama_program", req.query.q, {
            type: "websearch",
            config: "english"
        })
    response = await (req.query.full == "true" ?
        response :
        response.eq("is_accepted", true)
    )
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

exports.update = async (req, res, next) => {
    if (req.body.nama_program) {
        req.body.slug = req.body.nama_program.replace(/[?&]/g, "").toLowerCase().trim().replaceAll(" ", "-")
    }

    req.abudabi = await supabase.client
        .from(table)
        .update(req.body)
        .eq(table_id, req.params.id_program_donasi)

    res.status(req.abudabi.status).send(req.abudabi)
    next()
}

exports.acceptDonasi = async (req, res) => {
    const response = await supabase.client
        .from("donasi")
        .update({"is_valid": true})
        .eq("id_donasi", req.params.id_donasi)
    
    return res.status(response.status).send(response)
}

exports.inspectDonatur = async (req, res) => {
    const response = await supabase.client
        .from("donasi")
        .select("*")
        .eq("id_program_donasi", req.params.id_program_donasi)

    return res.status(response.status).send(response)        
}

exports.insert = async (req, res, next) => {
    if (req.body.nama_program) {
        req.body.slug = req.body.nama_program.replace(/[?&]/g, "").toLowerCase().trim().replaceAll(" ", "-")
    }

    req.abudabi = await supabase.client
        .from(table)
        .insert(req.body)
        .select("*")

    res.status(req.abudabi.status).send(req.abudabi)
    next()
}

exports.delete = async (req, res, next) => {
    req.abudabi = await supabase.client
        .from(table)
        .delete()
        .eq(table_id, req.params.id)
        .select("*")

    res.status(req.abudabi.status).send(req.abudabi)
    next()
};

exports.donasi = async (req, res) => {
    if (req.file.is_upp) {
        let abudabas = req.file.is_upp ? req.file.id : null    
        const response = await supabase.client
            .from("donasi")
            .insert({
                id_pengguna: req.internalUserId,
                id_program_donasi: req.params.id_program_donasi,
                nominal: req.body.nominal,
                bukti_pembayaran_address: abudabas,
                nama: req.body.nama,
                doa: req.body.doa
            })
    
        return res.status(response.status).send(response)
    }

    return res.status(400).send("Bukti pembayaran is required")


}

exports.inspect = async (req, res) => {
    const response = await supabase.client
        .from("donasi")
        .select("nominal, pengguna(nama_lengkap)", { count: "exact" })
        .eq("id_program_donasi", req.params.id_program_donasi)
        .eq("is_valid", true)

    let result = 0;
    let donatur = [];    
    if (response.count >= 1) {
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

exports.single = async (req, res) => {
    const response = await supabase.client
        .from(table)
        .select("*")
        .limit(1)
        .single()
    
    return res.status(response.status).send(response)
}
