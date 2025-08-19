var router = require('express').Router();
const controller = require("../controller/pertemuanKelasController.js")
const { auth, auth_mentor, authenticated_mentor } = require("../middleware/auth.js")

// Registred User
router.get("/:id_pertemuan_kelas", auth, controller.index)

// Authenticated Mentor
router.post("/insert/:id_kelas", auth_mentor, authenticated_mentor, controller.insert)

module.exports = router;