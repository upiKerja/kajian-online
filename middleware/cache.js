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
    console.log(req.method)
    console.log(req.abudabi.status)
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
/*
    Ini make Cursor ygy.
*/
exports.notify_pertemuan_kelas = async (req, res, next) => {
    console.log("RIJAL")
    const supabase = require("../database/supabase").client;
    try {
        // Check if this is a successful POST request for pertemuan_kelas creation
        if (
            req.method === "POST" && 
            req.originalUrl.includes("/kelas/pertemuan/insert") &&
            res.statusCode >= 200 && 
            res.statusCode < 300
        ) {
            const id_kelas = req.params.id_kelas;
            const pertemuanData = res.locals.pertemuanData || req.body;
            
            // Get all registered users for this class
            const { data: registeredUsers, error: usersError } = await supabase
                .from("log_kelas")
                .select("id_pengguna, kelas(judul)")
                .eq("id_kelas", id_kelas);

            if (usersError) {
                console.error("Error fetching registered users:", usersError);
                return next();
            }

            if (registeredUsers && registeredUsers.length > 0) {
                // Create notifications for all registered users
                const notifications = registeredUsers.map(user => ({
                    to: user.id_pengguna,
                    title: "Pertemuan Baru",
                    message: `Pertemuan baru "${pertemuanData.judul}" telah ditambahkan ke kelas "${user.kelas.judul}"`,
                    type: "new_pertemuan",
                    is_read: false
                }));

                // Insert notifications in batch
                const { error: notificationError } = await supabase
                    .from("notifications")
                    .insert(notifications);

                if (notificationError) {
                    console.error("Error creating notifications:", notificationError);
                } else {
                    console.log(`Notifications sent to ${notifications.length} users for new pertemuan_kelas`);
                }
            }
        }
    } catch (err) {
        console.error("Notification middleware error:", err);
    }
    
    next();
};