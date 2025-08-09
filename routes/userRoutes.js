const express = require('express');
const router = express.Router();

/* GET user info. */
router.get('/', function(req, res, next) {
  res.send(req.user)
});

module.exports = router;