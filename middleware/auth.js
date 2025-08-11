var jwt = require("jsonwebtoken")
var exports = module.exports = {}

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