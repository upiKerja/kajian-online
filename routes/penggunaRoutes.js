const express = require('express');
const router = express.Router();
const controller = require("../controller/penggunaController")
const { cache } = require("../middleware/cache");
const { auth_admin } = require("../middleware/auth");

router.get('/select', auth_admin, cache, controller.select)
router.get('/cari', auth_admin, cache, controller.cari)
router.get('/carisemua', auth_admin, cache, controller.carisemua)
router.post('/insert', auth_admin, controller.insert)
router.delete('/delete/:id', auth_admin, controller.delete)
router.put('/update/:id', auth_admin, controller.update)

module.exports = router;