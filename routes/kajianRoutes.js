var express = require('express');
var router = express.Router();
var controller = require("../controller/kajianController")

router.get('/select', controller.select)
router.get('/cari', controller.cari)
router.get('/carisemua', controller.carisemua)
router.post('/insert', controller.insert)
router.delete('/delete', controller.delete)

module.exports = router;