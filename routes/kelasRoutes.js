const express = require('express');
const router = express.Router();
const controller = require("../controller/kelasController")
const { cache } = require("../middleware/cache");
const { auth } = require("../middleware/auth")

router.get('/index/:slug', cache, controller.indexes)
router.get('/select', cache, controller.select)
router.get('/cari', cache, controller.cari)
router.get('/carisemua', cache, controller.carisemua)
router.post('/insert', controller.insert)
router.put('/update/:id', controller.update)
router.delete('/delete/:id', controller.delete)
router.post('/daftar/:id_kelas', auth, controller.daftar)

module.exports = router;