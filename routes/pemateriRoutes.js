const express = require('express');
const router = express.Router();
const controller = require("../controller/pemateriController")

router.get('/select', controller.select)
router.get('/cari', controller.cari)
router.get('/carisemua', controller.carisemua)
router.post('/insert', controller.insert)
router.delete('/delete/:id', controller.delete)

module.exports = router;