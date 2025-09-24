var router = require('express').Router();
var { auth } = require('../middleware/auth')
var { client } = require("../database/supabase");
const { cache } = require('../middleware/cache');

router.get("/login/:provider", async (req, res, next) => {
    try {
        if (
            process.env.AUTH_PROVIDERS.split(",")
            .indexOf(req.params.provider) !== -1
        ) {
            let redirect_url = process.env.SUPABASE_AUTH_URL
                .replace("PROVIDER", req.params.provider)
                .replace("REDIRECT_TO", process.env.AUTH_REDIRECT_TO)
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

module.exports = router;