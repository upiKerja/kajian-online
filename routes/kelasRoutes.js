const express = require('express');
const router = express.Router();
const controller = require("../controller/kelasController")
const { cache, flush_cache } = require("../middleware/cache");
const { auth, auth_mentor, authenticated_mentor, auth_admin } = require("../middleware/auth")
const { fileHandler, main_uploader } = require("../controller/fileuploadController");
const { baseHandlingChange, baseAutoChange } = require("../middleware/file")

// Guess
router.get('/index/:slug_kelas', cache, controller.indexes)
router.get('/cari', cache, controller.cari)
router.get('/discover', cache, controller.discover)
router.get('/meta/:slug_kelas', cache, controller.meta)
router.get('/p/:id_kelas', controller.pertemuan_kelas)

// User
router.post('/daftar/:id_kelas', auth, controller.daftar)
router.get('/is_user_registred/:id_kelas', auth, controller.is_registred)

// Admin
router.get('/stats', auth_admin, cache, controller.stats)
router.put('/sudo/update/:id_kelas', auth_admin, controller.sudoUpdate, flush_cache)
router.put('/accept/:id_kelas', auth_admin, controller.accept, flush_cache)
router.delete('/delete/:id_kelas', auth_admin, controller.delete, flush_cache)

// Mentor
router.post(
    '/insert',
    auth_mentor,
    main_uploader.single("thumbnail"),
    baseHandlingChange("thumbnail_file_address"),
    controller.insert
)
router.get('/carisemua', auth_mentor, controller.carisemua)
router.get('/select', auth_mentor, cache, controller.select)

// Authenticated Mentor
// router.put('/update/:id_kelas', auth_mentor, authenticated_mentor, controller.update, flush_cache)

// Allias
router.get('/:slug_kelas/meta', cache, controller.meta)
router.get('/:slug_kelas', cache, controller.indexes)
router.get('/:id_kelas/is_user_registred', auth, controller.is_registred)

router.get('/:id_kelas/pertemuan', controller.pertemuan_kelas)
router.put('/:id_kelas/accept', auth_admin, controller.accept, flush_cache)
router.delete('/:id_kelas/delete', auth_admin, controller.delete, flush_cache)

router.put(
    '/:id_kelas/thumbnail/:id_file',
    auth_mentor,
    authenticated_mentor,
    fileHandler.single("thumbnail"),
    baseAutoChange("kelas", "thumbnail_file_address", "id_kelas")
)

router.put(
    '/thumbnail/:id_file',
    auth_mentor,
    authenticated_mentor,
    fileHandler.single("thumbnail"),
    baseAutoChange("")
)

router.put(
    '/:id_kelas/update',
    auth_mentor,
    authenticated_mentor,
    controller.update,
    flush_cache
)

module.exports = router;