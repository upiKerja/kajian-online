var exports = module.exports = {}
var supabase = require("../database/supabase")
var table = "kelas"
var table_id = "id_" + table

exports.carisemua = async (req, res, next) => {
    const { data, error } = await supabase.client
        .from(table)
        .select("*, pengguna(nama_lengkap, foto_url, id_pengguna)")

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

exports.cari = async (req, res, next) => {
    const { data, error } = await supabase.client
        .from(table)
        .select("*, pengguna(nama_lengkap, foto_url, id_pengguna)")
        .limit(10)
        .textSearch("judul", req.query.q, {
            type: "websearch",
            config: "english"
        })

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

exports.select = async (req, res) => {
    const { error, data } = await supabase.client
    .from(table)
    .select("*")
    .eq(req.query.w, req.query.eq)

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

exports.indexes = async (req, res) => {
    const { data, error } = await supabase.client
        .from(table)
        .select("*, pengguna(nama_lengkap, foto_url, id_pengguna)")
        .limit(1)
        .eq("slug", req.params.slug_kelas)

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
        data: data[0]
    })
}

exports.sudoUpdate = async (req, res) => {
    // Route Update khusus Admin
    const response = await supabase.client
        .from(table)
        .update(req.body)
        .eq(table_id, req.params.id_kelas)

    if (!response.error) {
        return res.status(response.status).send({
            message: response.statusText,
            status: "success",
            data: response.data
        })
    }
    return res.status(response.status).send({
        message: response.statusText,
        status: "failed",
        error: response.error
    })    
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

    if (!response.error) {
        return res.status(response.status).send({
            message: response.statusText,
            status: "success",
            data: response.data
        })
    }
    return res.status(response.status).send({
        message: response.statusText,
        status: "failed",
        error: response.error
    })
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

    if (response.error) {
        return res.status(response.status).send({
            message: response.statusText,
            status: "failed",
            error: response.error
        });
    }
    return res.status(response.status).send(
        ({ message: response.statusText, data: response.data })
    );
}

exports.delete = async (req, res) => {
    const response = await supabase.client
        .from(table)
        .delete()
        .eq(table_id, req.params.id)
        .select("*")

    if (response.error) {
        return res.status(400).send({
            message: response.statusText,
            status: "failed",
            error: response.error
        });
    }
    return res.status(response.status).send({
        message: "success",
        status: "success",
        data : response.data});
};

exports.daftar = async (req, res) => {
    const response = await supabase.client
        .from("log_kelas")
        .insert({
            id_pengguna: req.internalUserId,
            id_kelas: req.params.id_kelas
        })

    res.status(response.status).send({
        message: response.statusText
    })    
}