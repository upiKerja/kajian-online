const express = require('express');
const router = express.Router();
const controller = require("../controller/kajianController")
const { cache, flush_cache } = require("../middleware/cache");
const { auth_admin } = require("../middleware/auth")
const { fileHandler, main_uploader } = require("../controller/fileuploadController");
const { baseHandlingChange, baseAutoChange } = require("../middleware/file")

// Guess
router.get('/index/:slug_kajian', cache, controller.indexes)
router.get('/cari', cache, controller.cari)
router.get('/discover', cache, controller.discover)
router.get('/meta/:slug_kajian', cache, controller.meta)

// Admin
router.get('/select', auth_admin, cache, controller.select)
router.get('/carisemua', auth_admin, cache,  controller.carisemua)
router.get('/stats', auth_admin, cache, controller.stats)
router.post('/insert', auth_admin, controller.insert, flush_cache)
router.put('/update/:id_kajian', auth_admin, controller.update, flush_cache)
router.delete('/delete/:id_kajian', auth_admin, controller.delete, flush_cache)

router.post(
    '/insert_with_thumbnail',
    auth_admin,
    main_uploader.single("thumbnail"),
    baseHandlingChange("id_thumbnail_address"),
    controller.insert
)

router.put(
    '/:id_kajian/thumbnail/:id_file',
    auth_admin,
    fileHandler.single("thumbnail"),
    baseAutoChange("kajian", "id_thumbnail_address", "id_kajian")
)

module.exports = router;