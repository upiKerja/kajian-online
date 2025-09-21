const express = require('express');
const router = express.Router();
const controller = require("../controller/mentorformController")
const { cache } = require("../middleware/cache");
const { auth_admin, auth } = require("../middleware/auth")

// User
router.post('/insert', auth, controller.insert)
router.get('/mine', auth, controller.indexes)

// Admin
router.get('/carisemua', auth_admin, cache,  controller.carisemua)
router.put('/update/:id_mentor_form', auth_admin, controller.update)
router.delete('/delete/:id_mentor_form', auth_admin, controller.delete)

module.exports = router;