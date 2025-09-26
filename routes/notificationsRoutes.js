const express = require('express');
const router = express.Router();
const controller = require("../controller/notificationsController")
const { cache } = require("../middleware/cache");
const { auth, auth_admin } = require("../middleware/auth")

// User
router.get('/my', auth, cache, controller.my)
router.put('/read/:id_notification', auth, controller.markRead)

// Admin
router.get('/carisemua', auth_admin, controller.carisemua)
router.get('/select', auth_admin, controller.select)
router.post('/insert', auth_admin, controller.insert)
router.put('/update/:id_notification', auth_admin, controller.update)
router.delete('/delete/:id_notification', auth_admin, controller.delete)

module.exports = router;


