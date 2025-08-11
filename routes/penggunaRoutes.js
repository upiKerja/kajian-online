const express = require('express');
const router = express.Router();
const controller = require("../controller/penggunaController")
const { cache } = require("../middleware/cache");

router.get('/select', cache, controller.select)
router.get('/cari', cache, controller.cari)
router.get('/carisemua', cache, controller.carisemua)
router.post('/insert', controller.insert)
router.delete('/delete/:id', controller.delete)

module.exports = router;