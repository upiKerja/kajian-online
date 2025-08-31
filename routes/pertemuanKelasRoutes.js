var router = require('express').Router();
const controller = require("../controller/pertemuanKelasController.js")
const { auth, auth_mentor, authenticated_mentor } = require("../middleware/auth.js")

// Registred User
router.get("/:id_pertemuan_kelas", auth, controller.index)

// Auth Mentor
router.get("/:id_pertemuan_kelas/m", auth_mentor, controller.index_m)

// Authenticated Mentor
router.post("/insert/:id_kelas", auth_mentor, authenticated_mentor, controller.insert)
router.delete("/:id_kelas/:id_pertemuan_kelas/delete", auth_mentor, authenticated_mentor, controller.delete)
// router.put("/:id_kelas/:id_pertemuan_kelas/update", auth_mentor, authenticated_mentor, controller.update)

module.exports = router;