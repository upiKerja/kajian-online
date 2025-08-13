const express = require('express');
const router = express.Router();
const controller = require("../controller/kelasController")
const { cache } = require("../middleware/cache");
const { auth, auth_mentor, authenticated_mentor, auth_admin } = require("../middleware/auth")

// Guess
router.get('/index/:slug_kelas', cache, controller.indexes)
router.get('/cari', cache, controller.cari)
router.get('/carisemua', cache, controller.carisemua)

// Authenticated User
router.post('/daftar/:id_kelas', auth, controller.insert)

// Admin
router.get('/select', auth_admin, controller.select)
router.post('/insert', auth_admin, controller.insert)
router.delete('/delete/:id_kelas', auth_admin, controller.delete)

// Mentor yang melakukan assign
router.put('/update/:id_kelas', auth_mentor, authenticated_mentor, controller.update)

module.exports = router;