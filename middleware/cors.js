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

        res.set("Access-Controll-Allow-Origin", req.headers.origin)
        res.set("Access-Controll-Allow-Credentials", "true")
        res.set("Access-Control-Allow-Methods", "GET, POST, DELETE, PUT")

        return next()
    } catch(err) {
        return res.status(503).send({
            "msg" : err.massage,
            "error" : err
        })
    }
}