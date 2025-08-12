const express = require('express');
const router = express.Router();
const { cache } = require("../middleware/cache");
const { auth, auth_mentor, auth_admin} = require("../middleware/auth")

/* GET user info. */
router.get('/', auth, cache, function(req, res, next) {
  res.send(req.user)
});

router.get('/admin', auth_admin, cache, function(req, res, next) {
  res.send(req.user)
});

router.get('/mentor', auth_mentor, cache, function(req, res, next) {
  res.send(req.user)
});

module.exports = router;