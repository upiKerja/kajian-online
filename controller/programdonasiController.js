var exports = module.exports = {}
var supabase = require("../database/supabase")
var table = "program_donasi"
var table_id = "id_" + table

exports.carisemua = async (req, res, next) => {
    const response = await supabase.client
        .from(table)
        .select("*, pengguna(nama_lengkap, foto_url)")

    return res.status(response.status).send(response)
}

exports.discover = async (req, res) => {
    const response = await supabase.client
        .from(table)
        .select("*, pengguna(nama_lengkap, foto_url)")
        .eq("is_accepted", true)
        .limit(req.query.limit || 20)

    return res.status(response.status).send(response)
}

exports.cari = async (req, res, next) => {
    const response = await supabase.client
        .from(table)
        .select("judul, slug, pengguna(nama_lengkap, foto_url)")
        .eq("is_accepted", true)
        .limit(10)
        .textSearch("judul", req.query.q, {
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
        .select("*, pengguna(nama_lengkap, foto_url)")
        .single()
        .eq("slug", req.params.slug)

    return res.status(response.status).send(response)
}

exports.update = async (req, res) => {
    
    if (!req.body.id_mentor) {
        return res.status(400).json({ error: "id_mentor is required" });
    }
    
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
    if (!req.body.id_mentor) {
        return res.status(400).json({ error: "id_mentor is required" });
    }

    if (req.body.nama_program) {
        req.body.slug = req.body.nama_program.replace(/[?&]/g, "").toLowerCase().trim().replaceAll(" ", "-")
    }

    const response = await supabase.client
        .from(table)
        .insert(req.body)
        .select("*, pengguna(role)")

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
            id_mentor: req.internalUserId,
            id_program_donasi: req.params.id_program_donasi
        })

    return res.status(response.status).send(response)
}
