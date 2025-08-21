const express = require('express');
const router = express.Router();
const controller = require("../controller/programdonasiController")
const { cache } = require("../middleware/cache");
const { auth, auth_mentor, authenticated_mentor, auth_admin } = require("../middleware/auth")

// Guess
router.get('index/:slug', cache, controller.indexes)
router.get('/cari', cache, controller.cari)
router.get('/discover', cache, controller.discover)

// User
router.post('/donasi/:id_program_donasi', auth, controller.donasi)

// Admin
router.get('/select', auth_admin, controller.select)
router.get('/carisemua', auth_admin, controller.carisemua)  
router.put('/update/:id_program_donasi', auth_admin, controller.update)
router.post('/insert', auth_admin, controller.insert)
router.delete('/delete/:id_program_donasi', auth_admin, controller.delete)

module.exports = router;