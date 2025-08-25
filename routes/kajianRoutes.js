const express = require('express');
const router = express.Router();
const controller = require("../controller/kajianController")
const { cache } = require("../middleware/cache");
const { auth_admin } = require("../middleware/auth")

// Guess
router.get('/index/:slug_kajian', cache, controller.indexes)
router.get('/cari', cache, controller.cari)
router.get('/discover', cache, controller.discover)

// Admin
router.get('/select', auth_admin, controller.select)
router.get('/carisemua', auth_admin, controller.carisemua)
router.post('/insert', auth_admin, controller.insert)
router.put('/update/:id_kajian', auth_admin, controller.update)
router.delete('/delete/:id_kajian', auth_admin, controller.delete)

module.exports = router;