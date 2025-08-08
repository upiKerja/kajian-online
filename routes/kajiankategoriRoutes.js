const express = require('express');
const router = express.Router();
const controller = require("../controller/kajiankategoriController")

router.get('/select', controller.select)
router.get('/cari', controller.cari)
router.get('/carisemua', controller.carisemua)
router.post('/insert', controller.insert)
router.delete('/delete', controller.delete)

module.exports = router;