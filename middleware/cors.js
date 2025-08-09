var dotenv = require("dotenv")
var exports = module.exports = {}
dotenv.config()

exports.cors = async (req, res, next) => {
    try {
        const allowed_domains = process.env.CORS_ALLOWED_DOMAINS.split(",")
        if (!req.headers.origin) {
          return next()
        }
        if (allowed_domains.indexOf(req.headers.origin) === -1) {
          return res.status(403).send({
            "msg" : "Invalid CORS"
          })
        }
        return next()
    } catch(err) {
        return res.status(503).send({
            "msg" : err.massage,
            "error" : err
        })
    }
}