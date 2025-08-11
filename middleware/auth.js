var jwt = require("jsonwebtoken")
var exports = module.exports = {}
var supabase = require("../database/supabase").client

exports.auth = async (req, res, next) => {
    try {
        const user = jwt.verify(req.cookies.access_token, process.env.SUPABASE_JWT_KEY)
        req.user = user.user_metadata
        return next()
    } catch(err) {
        return res.status(401).send({
            "msg" : "access_token is required",
            "error" : err
        })
    }
}

exports.auth_mentor = async (req, res, next) => {
    try {
        const user = jwt.verify(req.cookies.access_token, process.env.SUPABASE_JWT_KEY)
        const { data } = await supabase
            .from("pengguna")
            .select("role")
            .eq("auth", user.sub)

        if (data[0].role != "biasa") {
            req.user = user.user_metadata
            console.log(data[0].role)
            return next()
        }
        return res.status(403).send(
            "<h1>403 Forbidden</h1>"
        )

    } catch(err) {
        return res.status(401).send({
            "msg" : "access_token is required",
            "error" : err
        })
    }
}