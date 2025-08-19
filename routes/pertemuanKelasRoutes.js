var router = require('express').Router();
var { client } = require("../database/supabase");
const controller = require("../controller/pertemuanKelasController.js")
const { auth } = require("../middleware/auth.js")

router.get("/index/:id_pertemuan_kelas", auth, controller.index)

module.exports = router;