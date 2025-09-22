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
    const { data } = await client
        .from("pengguna")
        .select("*, log_kelas(kelas(slug, judul, status, link_kelas))")
        .eq("id_pengguna", req.internalUserId)
        .single()

    res.send(data)
})

module.exports = router;