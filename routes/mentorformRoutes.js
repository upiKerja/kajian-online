const express = require('express');
const router = express.Router();
const controller = require("../controller/mentorformController")
const { cache, flush_cache } = require("../middleware/cache");
const { auth_admin } = require("../middleware/auth")

router.get('/carisemua', auth_admin, cache,  controller.carisemua)
router.post('/insert', auth_admin, controller.insert)
router.put('/update/:id_mentor_form', auth_admin, controller.update)
router.delete('/delete/:id_mentor_form', auth_admin, controller.delete)

module.exports = router;