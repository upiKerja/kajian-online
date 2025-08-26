var exports = module.exports = {}

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

        res.set("Access-Control-Allow-Origin", req.headers.origin)
        res.set("Access-Control-Allow-Credentials", "true")
        res.set("Access-Control-Allow-Methods", "GET, POST, DELETE, PUT")
        res.set("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization, Cookie")

        return next()
    } catch(err) {
        return res.status(503).send({
            "msg" : err.massage,
            "error" : err
        })
    }
}