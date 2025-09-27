var exports = module.exports = {}
var supabase = require("../database/supabase")
var table = "kajian"
var table_id = "id_" + table

exports.carisemua = async (req, res, next) => {
    const response = await supabase.client
        .from(table)
        .select("*, kajian_kategori(slug, nama)")
        .order("created_at", { ascending: false })

    return res.status(response.status).send(response)
}

exports.meta = async (req, res) => {
    const response = await supabase.client
        .from(table)
        .select("judul, deskripsi, thumbnail_url, deskripsi_lengkap")
        .eq("slug", req.params.slug_kajian)
        .single()

    if (response.status != 200) {
        response.status = 404
    }
    return res.status(response.status).send(response)

}

exports.cari = async (req, res, next) => {
    let response = supabase.client
        .from(table)
        .select("*")
        .limit(10 || req.query.limit)
        .textSearch("judul", req.query.q, {
            type: "websearch",
            config: "english"
        })
    response = await (req.query.full == "true" ?
        response :
        response.eq("status", "aktif")
    )
    return res.status(response.status).send(response)
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
    const response = await supabase.client
        .from(table)
        .select("*")
        .eq("slug", req.params.slug_kajian)
        .single()

    return res.status(response.status).send(response)
}

exports.discover = async (req, res) => {
    const response = await supabase.client
        .from(table)
        .select("*")
        .limit(req.query.limit || 20)

    return res.status(response.status).send(response)
}

exports.update = async (req, res, next) => {
    req.abudabi = await supabase.client
        .from(table)
        .update(req.body)
        .eq(table_id, req.params.id_kajian)
        .select("slug")
        .single()

    res.status(req.abudabi.status).send(req.abudabi)
    next()
}

exports.insert = async (req, res, next) => {
    if (req.body.judul) {
        req.body.slug = req.body.judul.replace(/[?&]/g, "").toLowerCase().trim().replaceAll(" ", "-")
    } 
    
    req.abudabi = await supabase.client
        .from(table)
        .insert(req.body)
        .select("*")
        .single()

    res.status(req.abudabi.status).send(req.abudabi)
    next()
}

exports.delete = async (req, res, next) => {
    req.abudabi = await supabase.client
        .from(table)
        .delete()
        .eq(table_id, req.params.id_kajian)
        .select("slug")
        .single()

    res.status(req.abudabi.status).send(req.abudabi)
    next()
};

exports.stats = async (req, res) => {
    try {
        // Get all kajian with is_accepted field
        const kajianResponse = await supabase.client
            .from(table)
            .select("status")

        let totalKajian = 0;
        let totalKajianAktif = 0;

        if (kajianResponse.data && kajianResponse.data.length > 0) {
            totalKajian = kajianResponse.data.length;
            totalKajianAktif = kajianResponse.data.filter(kajian => kajian.status === "aktif").length;
        }

        const stats = {
            total_kajian: totalKajian,
            total_kajian_aktif: totalKajianAktif
        };

        res.status(200).send({
            status: 200,
            statusText: "OK",
            data: stats
        });

    } catch (error) {
        res.status(500).send({
            status: 500,
            statusText: "Internal Server Error",
            error: error.message
        });
    }
};