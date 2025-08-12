const express = require('express');
const router = express.Router();
const { auth, auth_mentor, auth_admin} = require("../middleware/auth")

/* GET user info. */
router.get('/', auth, (req, res) => {
  res.send(req.user)
});

router.get('/mentor', auth_mentor, (req, res) =>{
  res.send(req.user)
});

router.get('/admin', auth_admin, (req, res) => {
  res.send(req.user)
});

module.exports = router;