const express = require('express');
const router = express.Router();
const controller = require("../controller/kelasController")
const { cache } = require("../middleware/cache");
const { auth, auth_mentor, authenticated_mentor, auth_admin } = require("../middleware/auth")

// Guess
router.get('/index/:slug_kelas', cache, controller.indexes)
router.get('/cari', cache, controller.cari)
router.get('/discover', cache, controller.discover)

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