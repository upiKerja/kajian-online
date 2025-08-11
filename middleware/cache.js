var exports = module.exports = {}

exports.cache = async (req, res, next) => {
    const redis = req.app.locals.redis;

    if (!redis || !redis.isOpen) {
        console.warn("Redis is not connected. Skipping cache middleware.");
        return next();
    }

    try {

        const cacheData = await redis.get(req.originalUrl);
        if (cacheData) {
            console.log("Cache hit:", req.originalUrl);
            return res.send(JSON.parse(cacheData));
        }
        console.log("Cache miss:", req.originalUrl);

        const originalSend = res.send.bind(res);
        res.send = (body) => {
            redis.set(req.originalUrl, JSON.stringify(body), 'EX', 3600); // Cache for 1 hour
            console.log("Cache set for:", req.originalUrl);
            return originalSend(body);
        };

        next();
    } catch (err) {
        console.error("Redis error:", err);
        next();
    }
};