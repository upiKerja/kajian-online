const express = require('express');
const router = express.Router();
const controller = require("../controller/penggunaController")
const { cache } = require("../middleware/cache");
const { auth, auth_admin } = require("../middleware/auth");

// Guess
router.get('/cari', cache, controller.cari)

// Admin
router.get('/select', auth_admin, cache, controller.select)
router.get('/carisemua', auth_admin, cache, controller.carisemua)

// User
router.delete('/delete', auth, controller.delete)
router.put('/update', auth, controller.update)

module.exports = router;