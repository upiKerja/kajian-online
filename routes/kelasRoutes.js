const express = require('express');
const router = express.Router();
const controller = require("../controller/kelasController")
const { cache } = require("../middleware/cache");
const { auth, auth_mentor, authenticated_mentor, auth_admin } = require("../middleware/auth")

// Allias
router.get('/:slug_kelas/meta', cache, controller.meta)
router.get('/:slug_kelas', cache, controller.indexes)

router.get('/:id_kelas/pertemuan', controller.pertemuan_kelas)
router.put('/:id_kelas/sudo/update', auth_admin, controller.sudoUpdate)
router.put('/:id_kelas/accept', auth_admin, controller.accept)
router.put('/:id_kelas/update', auth_mentor, authenticated_mentor, controller.update)
router.delete('/:id_kelas/delete', auth_admin, controller.delete)

// Guess
router.get('/index/:slug_kelas', cache, controller.indexes)
router.get('/cari', cache, controller.cari)
router.get('/discover', cache, controller.discover)
router.get('/meta/:slug_kelas', cache, controller.meta)
router.get('/p/:id_kelas', controller.pertemuan_kelas)

// User
router.post('/daftar/:id_kelas', auth, controller.daftar)

// Admin
router.get('/select', auth_admin, controller.select)
router.get('/carisemua', auth_admin, controller.carisemua)
router.put('/sudo/update/:id_kelas', auth_admin, controller.sudoUpdate)
router.put('/accept/:id_kelas', auth_admin, controller.accept)
router.delete('/delete/:id_kelas', auth_admin, controller.delete)

// Mentor
router.post('/insert', auth_mentor, controller.insert)

// Authenticated Mentor
router.put('/update/:id_kelas', auth_mentor, authenticated_mentor, controller.update)

module.exports = router;