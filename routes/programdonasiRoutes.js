const express = require('express');
const router = express.Router();
const controller = require("../controller/programdonasiController")
const { cache, flush_cache } = require("../middleware/cache");
const { auth, auth_admin } = require("../middleware/auth")
const { fileHandler, main_uploader } = require("../controller/fileuploadController");
const { baseHandlingChange, baseAutoChange } = require("../middleware/file")

// Guess
router.get('/index/:slug', cache, controller.indexes)
router.get('/cari', cache, controller.cari)
router.get('/discover', cache, controller.discover)
router.get('/single', cache, controller.single)

// User
router.post(
    '/donasi/:id_program_donasi',
    auth,
    main_uploader.single("bukti_donasi"),
    controller.donasi
)

// Admin
router.get('/select', auth_admin, controller.select)
router.get('/carisemua', auth_admin, controller.carisemua)  
router.get('/inspect/:id_program_donasi', auth_admin, controller.inspect)
router.put('/update/:id_program_donasi', auth_admin, controller.update, flush_cache)
router.put('/accept/:id_program_donasi', auth_admin, controller.accept, flush_cache)
router.delete('/delete/:id_program_donasi', auth_admin, controller.delete, flush_cache)

router.get(
    '/:id_program_donasi/donatur',
    auth_admin,
    controller.inspectDonatur
)

router.put(
    '/:id_program_donasi/donatur/:id_donasi/accept',
    auth_admin,
    controller.acceptDonasi
)

router.post(
    '/insert',
    auth_admin,
    main_uploader.single("thumbnail"),
    baseHandlingChange("id_static_file_address"),
    controller.insert
)

router.put(
    '/thumbnail/:id_file',
    auth_admin,
    fileHandler.single("thumbnail"),
    baseAutoChange("")
)

// Allias
router.get('/:slug', cache, controller.indexes)

module.exports = router;