var exports = module.exports = {}
var supabase = require("../database/supabase")
var table = "kelas"
var table_id = "id_" + table

exports.carisemua = async (req, res, next) => {
    const response = await supabase.client
        .from(table)
        .select("*, pengguna(nama_lengkap, foto_url)")

    return res.status(response.status).send(response)
}

exports.discover = async (req, res) => {
    const response = await supabase.client
        .from("kelas")
        .select("*, pengguna(nama_lengkap, foto_url)")
        .eq("is_accepted", true)
        .limit(req.query.limit || 20)

    return res.status(response.status).send(response)
}

exports.accept = async(req, res, next) => {
    req.abudabi = await supabase.client
        .from("kelas")
        .update({is_accepted: true})
        .eq("id_kelas", req.params.id_kelas)
        .select("slug")
        .single()

    res.status(req.abudabi.status).send(req.abudabi)    
    next()
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
        .eq("slug", req.params.slug_kelas)

    return res.status(response.status).send(response)
}

exports.meta = async (req, res) => {
    const response = await supabase.client
        .from(table)
        .select("judul, deskripsi, thumbnail_url")
        .eq("slug", req.params.slug_kelas)
        .single()

    if (response.status != 200) {
        response.status = 404
    }
    return res.status(response.status).send(response)

}

exports.sudoUpdate = async (req, res, next) => {
    // Route Update khusus Admin
    req.abudabi = await supabase.client
        .from(table)
        .update(req.body)
        .eq(table_id, req.params.id_kelas)
        .single()
        .select("*")

    res.status(req.abudabi.status).send(req.abudabi)
    next()
}

exports.update = async (req, res, next) => {
    // Route Update khusus authenticated mentor

    // Jaga-jaga kalo mau ngupdate Judul
    if (req.body.judul) {
        req.body.slug = req.body.judul.replace(/[?&]/g, "").toLowerCase().trim().replaceAll(" ", "-")
    } 

    // Data yang gaboleh di Update
    const {is_accepted, id_mentor, id_kelas, ...inih} = req.body
    req.body = inih
    req.body.is_accepted = false // Data yang udah diupdate harus di ACC lebih dulu ama Admin.

    req.abudabi = await supabase.client
        .from(table)
        .update(req.body)
        .eq(table_id, req.params.id_kelas)
        .select("slug")
        .single()

    res.status(req.abudabi.status).send(req.abudabi)
    next()
}

exports.insert = async (req, res, next) => {
    if (req.body.judul) {
        req.body.slug = req.body.judul.replace(/[?&]/g, "").toLowerCase().trim().replaceAll(" ", "-")
    } 
    
    const {is_accepted, ...inih} = req.body
    req.body = inih
    req.body.id_mentor = req.internalUserId

    req.abudabi = await supabase.client
        .from(table)
        .insert(req.body)
        .select("slug")

    res.status(req.abudabi.status).send(req.abudabi)
    next()
}

exports.delete = async (req, res, next) => {
    req.abudabi = await supabase.client
        .from(table)
        .delete()
        .eq(table_id, req.params.id)
        .select("slug")

    res.status(req.abudabi.status).send(req.abudabi)
    next()
};

exports.daftar = async (req, res) => {
    const response = await supabase.client
        .from("log_kelas")
        .insert({
            id_pengguna: req.internalUserId,
            id_kelas: req.params.id_kelas
        })

    return res.status(response.status).send(response)
}

exports.pertemuan_kelas = async (req, res) => {
    const response = await supabase.client
        .from("pertemuan_kelas")
        .select("*", {count: "exact"})
        .eq("id_kelas", req.params.id_kelas)
    
    if (response.count < 1) {
        response.status = 404
        response.statusText = "Not Found"
    }

    return res.status(response.status).send(response)        
}