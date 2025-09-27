var router = require('express').Router();
var { auth } = require('../middleware/auth')
var { client } = require("../database/supabase");
const { cache } = require('../middleware/cache');

router.get("/login", async (req, res, next) => {
    try {
        if (
            process.env.AUTH_PROVIDERS.split(",")
            .indexOf(req.query.provider) !== -1
        ) {
            let redirect_url = process.env.SUPABASE_AUTH_URL
                .replace("PROVIDER", req.query.provider)
                .replace("REDIRECT_TO", process.env.AUTH_REDIRECT_TO)
            if (req.query.r == "true") return res.redirect(redirect_url)
            return res.send({
                "msg" : "success",
                "redirect_url" : redirect_url
            })
        } else {
            return res.status(400).send({
                msg: "Invalid Provider"
            })
        }
    } catch(err) {
        res.send(err)
    }

})

router.get("/profile", auth, cache, async (req, res) => {
    const response = await client
        .from("pengguna")
        .select("*")
        .eq("id_pengguna", req.internalUserId)
        .single()

    res.send(response)
})

router.get("/stats", cache, async (req, res) => {
    try {
        // Get total program donasi
        const totalProgramResponse = await client
            .from("program_donasi")
            .select("*", { count: "exact", head: true })

        // Get total donasi terkumpul and total donatur
        const donasiResponse = await client
            .from("donasi")
            .select("nominal, id_pengguna")

        let totalDonasiTerkumpul = 0;
        let uniqueDonatur = new Set();

        if (donasiResponse.data && donasiResponse.data.length > 0) {
            donasiResponse.data.forEach(donasi => {
                totalDonasiTerkumpul += donasi.nominal;
                uniqueDonatur.add(donasi.id_pengguna);
            });
        }

        const stats = {
            total_program_donasi: totalProgramResponse.count || 0,
            total_donasi_terkumpul: totalDonasiTerkumpul,
            total_donatur: uniqueDonatur.size
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
})

module.exports = router;