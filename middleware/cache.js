exports.cache = async (req, res, next) => {
    const redis = req.app.locals.redis;

    if (!redis || !redis.isOpen) {
        console.warn("Redis is not connected. Skipping cache middleware.");
        return next();
    }

    try {
        const userKeyPart = req.internalUserId || "guest";
        const cacheKey = `${userKeyPart}:${req.originalUrl}`;

        const keyTTL = await redis.ttl(cacheKey);
        if (keyTTL === -2 || keyTTL === -1) {
            console.log(`Cache expired for: ${cacheKey}`);
        } else {
            console.log(`TTL for ${cacheKey}: ${keyTTL}s`);
        }
        
        const cacheData = await redis.get(cacheKey);
        if (cacheData) {
            console.log("Cache hit:", cacheKey);
            return res.send(JSON.parse(cacheData));
        }
        console.log("Cache miss:", cacheKey);

        const originalSend = res.send.bind(res);
        res.send = (body) => {
            redis.set(cacheKey, JSON.stringify(body), {EX : 1800 }); // 30 minute
            console.log("Cache set for:", cacheKey);
            return originalSend(body);
        };

        next();
    } catch (err) {
        console.error("Redis error:", err);
        next();
    }
};

exports.invalidateUserCache = async (redis, userId, routePath) => {
    if (!redis || !redis.isOpen) {
        console.warn("Redis is not connected. Cannot invalidate cache.");
        return;
    }
    const keyPattern = `${userId}:${routePath}`;
    await redis.del(keyPattern);
    console.log(`Cache invalidated for ${keyPattern}`);
};