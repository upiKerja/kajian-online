var exports = module.exports = {}
var supabase = require("../database/supabase").client

exports.index = async (req, res, next) => {
    let id_pengguna = req.internalUserId
    let id_pertemuan_kelas = req.params.id_pertemuan_kelas

    try {
        const response = await supabase
            .from("pertemuan_kelas")
            .select("*, kelas(id_kelas, slug, id_mentor, judul, log_kelas(id_pengguna), pengguna(nama_lengkap, foto_url, kontak))")
            .eq("kelas.log_kelas.id_pengguna", id_pengguna)
            .or(
                "id_pertemuan_kelas.eq." + id_pertemuan_kelas
            )
            .single()

        if (response.data.kelas.log_kelas[0]) {
            const {log_kelas, ...jadi} = response.data.kelas
            response.data.kelas = jadi
            res.status(response.status).send(response)
    
        } else {
            res.status(403).send({
                message: "User tidak terdaftar dalam kelas ini.",
                id_kelas: response.data.id_kelas,
                status: "failed",
            })
        }
    } catch(err) {
        res.status(503).send({
            message: "Internal Server Error",
            status: "Error"
        })
    }

}

exports.index_m = async(req, res) => {
    const response = await supabase
        .from("pertemuan_kelas")
        .select("*")
        .eq("id_pertemuan_kelas", req.params.id_pertemuan_kelas)
        .single()

    return res.status(response.status).send(response)        
}

exports.insert = async (req, res, next) => {
    if (!req.body.judul) {
        return res.status(400).send()
    }
    req.body.id_kelas = req.params.id_kelas
    req.body.slug = req.body.judul.replace(/[?&]/g, "").toLowerCase().trim().replaceAll(" ", "-")
    
    let response = await supabase
        .from("pertemuan_kelas")
        .insert(req.body)
        .single()

    return res.status(response.status).send(response)       
}

exports.delete = async (req, res) => {
    const response = await supabase
        .from("pertemuan_kelas")
        .delete()
        .eq("id_pertemuan_kelas", req.params.id_pertemuan_kelas)

    return res.status(response.status).send(response)
}

exports.update = async (req, res, next) => {
    req.body.id_kelas = req.params.id_kelas
    req.body.slug = req.body.judul.replace(/[?&]/g, "").toLowerCase().trim().replaceAll(" ", "-")
    const {id_pertemuan_kelas, id_pengguna, id_kelas,   ...inih} = req.body
    
    let response = await supabase
        .from("pertemuan_kelas")
        .update(inih)
        .eq("id_pertemuan_kelas", req.params.id_pertemuan_kelas)

    return res.status(response.status).send(response)     
}