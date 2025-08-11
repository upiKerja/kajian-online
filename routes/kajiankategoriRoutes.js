const express = require('express');
const router = express.Router();
const controller = require("../controller/kajiankategoriController")

router.get('/index/:slug',controller.indexes)
router.get('/select', controller.select)
router.get('/cari', controller.cari)
router.get('/carisemua', controller.carisemua)
router.post('/insert', controller.insert)
router.put('/update/:id', controller.update)
router.delete('/delete/:id', controller.delete)

module.exports = router;