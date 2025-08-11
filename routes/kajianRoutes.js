const express = require('express');
const router = express.Router();
const controller = require("../controller/kajianController")
const { cache } = require("../middleware/cache");

router.get('/index/:slug', cache, controller.indexes)
router.get('/select', cache, controller.select)
router.get('/cari', cache, controller.cari)
router.get('/carisemua', cache, controller.carisemua)
router.post('/insert', controller.insert)
router.put('/update/:id', controller.update)
router.delete('/delete/:id', controller.delete)

module.exports = router;