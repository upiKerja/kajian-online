var exports = module.exports = {}
var supabase = require("../database/supabase").client

exports.index = async (req, res, next) => {
    let id_pengguna = req.internalUserId
    let id_pertemuan_kelas = req.params.id_pertemuan_kelas

    const response = await supabase
        .from("pertemuan_kelas")
        .select("*, kelas(slug, id_mentor, judul, log_kelas(id_pengguna))")
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
            status: "failed",
        })
    }
}