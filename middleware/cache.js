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

        const originalJson = res.json.bind(res);
        res.json = (body) => {
            redis.set(req.originalUrl, JSON.stringify(body), {EX : 21600 }); // Cache for 6 Hours
            console.log("Cache set for:", req.originalUrl);
            return originalJson(body);
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


exports.get_or_set_for_auth = async (req, key, val) => {
    let pal;
    const redis = req.app.locals.redis;
    if (!redis || !redis.isOpen) {
        console.warn("Redis is not connected. Skipping cache middleware.");
        pal = await val()
        return pal.data.role.replace(/"/g, '');
    }

    try {
        const cacheData = await redis.get(key);
        if (cacheData) {
            console.log("Cache hit:", key);
            return JSON.parse(cacheData);
        }
        console.log("Cache miss:", key);

        // Set
        pal = await val()
        await redis.set(key, JSON.stringify(pal.data.role), 'EX', 3600);
        return pal.data.role.replace(/"/g, '');

    } catch (err) {
        console.error("Redis error:", err);
        return "rijal";
    }
};

exports.flush_cache = async (req, res, next) => { 
    const redis = req.app.locals.redis
    if (redis) {
        let splited = req.originalUrl.split("/")
        let rijal = splited[1] == "api" ? splited[2] : splited[1]
    
        if (
            ["POST", "PUT", "DELETE"].indexOf(req.method) !== -1
            & [200, 201, 204].indexOf(req.abudabi.status) !== -1
            & redis.isOpen
        ) {
            (await redis.keys(`*/${rijal}/*`)).forEach(key => {
                if (
                    key.includes(req.abudabi.data.slug) ||
                    !key.includes("-") ||
                    key.includes("id_" + rijal)
                ) redis.del(key).then(() => console.log("Cache Removed: " + key))
            })
        }
    }
}