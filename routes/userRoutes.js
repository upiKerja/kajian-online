const express = require('express');
const router = express.Router();
const { cache } = require("../middleware/cache");
const auth_mentor = require("../middleware/auth").auth_mentor

/* GET user info. */
router.get('/', auth_mentor, cache, function(req, res, next) {
  res.send(req.user)
});

module.exports = router;