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
        .eq("is_accepted", false)
        .limit(100)

    return res.status(response.status).send(response)
}

exports.pertemuan_kelas = async (req, res) => {
    const response = await supabase.client
        .from("pertemuan_kelas")
        .select("judul, id_pertemuan_kelas, slug_pertemuan_kelas, deskripsi", { count: "exact" })
        .eq("id_kelas", req.params.id_kelas)
    
    return res.status(response.status).send(response)   
}

exports.accept = async(req, res) => {
    const response = await supabase.client
        .from("kelas")
        .update({is_accepted: true})
        .eq("id_kelas", req.params.id_kelas)
        .single()

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
        .eq("id_kelas", req.params.id_kelas)

    return res.status(response.status).send(response)
}

exports.sudoUpdate = async (req, res) => {
    // Route Update khusus Admin
    const response = await supabase.client
        .from(table)
        .update(req.body)
        .eq(table_id, req.params.id_kelas)

    return res.status(response.status).send(response)
}

exports.update = async (req, res) => {
    // Route Update khusus authenticated mentor

    // Jaga-jaga kalo mau ngupdate Judul
    if (req.body.judul) {
        req.body.slug = req.body.judul.replace(/[?&]/g, "").toLowerCase().trim().replaceAll(" ", "-")
    } 

    // Data yang gaboleh di Update
    const {is_accepted, id_mentor, id_kelas, ...inih} = req.body
    req.body.is_accepted = false // Data yang udah diupdate harus di ACC lebih dulu ama Admin.
    req.body = inih

    const response = await supabase.client
        .from(table)
        .update(req.body)
        .eq(table_id, req.params.id_kelas)

    return res.status(response.status).send(response)
}

exports.insert = async (req, res) => {
    if (req.body.judul) {
        req.body.slug = req.body.judul.replace(/[?&]/g, "").toLowerCase().trim().replaceAll(" ", "-")
    } 
    
    const {is_accepted, ...inih} = req.body
    req.body = inih
    req.body.id_mentor = req.internalUserId

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

exports.daftar = async (req, res) => {
    const response = await supabase.client
        .from("log_kelas")
        .insert({
            id_pengguna: req.internalUserId,
            id_kelas: req.params.id_kelas
        })

    return res.status(response.status).send(response)
}